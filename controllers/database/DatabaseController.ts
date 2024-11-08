import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as Updates from "expo-updates";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import * as SQLite from "expo-sqlite";
import * as DBO from "./DatabaseOperationsController";

const dbName = "test.db";
const sqlDir = FileSystem.documentDirectory + "SQLite/";
const dbFilePath = sqlDir + dbName;

export async function loadDatabase() {
  const dbAsset = require(`../../assets/${dbName}`);
  const dbUri = Asset.fromModule(dbAsset).uri;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(sqlDir, {
      intermediates: true,
    });
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
}

export async function removeDatabase() {
  await FileSystem.deleteAsync(sqlDir + dbName, { idempotent: true });
}

export async function replaceDatabase(uri?: string) {
  // Remove the existing database
  await removeDatabase();

  if (uri) await FileSystem.copyAsync({ from: uri, to: dbFilePath });

  // Load the new database
  await loadDatabase();

  await Updates.reloadAsync();
}

export async function exportDatabase() {
  const dbPath = sqlDir + dbName;
  try {
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    if (!fileInfo.exists) {
      console.error("Database file not found.");
      return;
    }
    await Sharing.shareAsync(dbPath);
  } catch (error) {
    console.error("Error sharing the database file:", error);
  }
}

async function validateFileAndExtractUri(fileType: string, fileExtension: string): Promise<string> {
  const result = await DocumentPicker.getDocumentAsync({
    type: fileType,
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    throw new Error("Database import canceled");
  }

  const { uri } = result.assets[0];

  if (!uri.endsWith(fileExtension)) {
    throw new Error("Selected file is not a .db file.");
  }

  return uri;
}

/**
 * Import a .db file from the user's file system
 * @throws error in case something wrong happened
 */
export async function importDatabase() {
  const uri = await validateFileAndExtractUri("application/octet-stream", ".db");

  // Remove the existing database
  await removeDatabase();

  // Copy the new database file to the SQLite directory
  await FileSystem.copyAsync({ from: uri, to: dbFilePath });

  // Load the new database
  await loadDatabase();

  await Updates.reloadAsync();
}

interface Line {
  date: string; //14/07/2022
  account: string; //profile
  category: string; //category name
  amount: number; //price
  currency: string;
  description: string;
}

interface NewProfile {
  name: string;
  currency: string;
}

const profileSeparator = " /WITH CURRENCY/ ";

function convertProfileMap(profileMap: Map<string, boolean>): NewProfile[] {
  return Array.from(profileMap.keys()).map((p) => {
    const split = p.split(profileSeparator);
    const name = split[0];
    const currency = split[1];
    return {
      name: name,
      currency: currency,
    };
  });
}

function convertDateStringToUnix(date: string): number {
  const parts = date.split("/");
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);
  return new Date(year, month - 1, day).valueOf();
}

function getCategoryPromises(db: SQLite.SQLiteDatabase, lines: Line[]): Promise<Category | null>[] {
  const categoryPromises: Promise<Category | null>[] = [];
  for (const line of lines) categoryPromises.push(DBO.getCategoryByNameAsync(db, line.category));
  return categoryPromises;
}

function getProfilePromises(db: SQLite.SQLiteDatabase, lines: Line[]): Promise<Profile | null>[] {
  const profilePromises: Promise<Profile | null>[] = [];
  for (const line of lines) profilePromises.push(DBO.getProfileByNameAsync(db, line.account));
  return profilePromises;
}

export async function importDatabaseCsv(db: SQLite.SQLiteDatabase) {
  const uri = await validateFileAndExtractUri("text/csv", ".csv");
  const fileContents = await FileSystem.readAsStringAsync(uri);
  const parsedData = Papa.parse<Line>(fileContents, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  const newCategories: Map<string, boolean> = new Map();
  const newProfiles: Map<string, boolean> = new Map();
  const newExpenses: Expense[] = [];

  const categoryPromises: Promise<Category | null>[] = getCategoryPromises(db, parsedData.data);
  const profilePromises: Promise<Profile | null>[] = getProfilePromises(db, parsedData.data);

  for (const line of parsedData.data) {
    const { category, account, currency, amount, description, date } = line;
    newExpenses.push({
      id: 0, //placeholder
      category_id: 0, //placeholder
      profile_id: 0, //placeholder
      category_name: category,
      profile_name: account,
      profile_currency: currency,
      price: -amount,
      description: description,
      date: convertDateStringToUnix(date),
    });
  }

  const categories = await Promise.all(categoryPromises);
  const profiles = await Promise.all(profilePromises);

  for (let i = 0; i < newExpenses.length; i++) {
    newExpenses[i].category_id = categories[i]?.id ?? 0;
    newExpenses[i].profile_id = profiles[i]?.id ?? 0;
    newCategories.set(newExpenses[i].category_name, true);
    newProfiles.set(
      `${newExpenses[i].profile_name}${profileSeparator}${newExpenses[i].profile_currency}`,
      true,
    );
  }
  addDataToDb(db, convertProfileMap(newProfiles), Array.from(newCategories.keys()), newExpenses);
}

async function addDataToDb(
  db: SQLite.SQLiteDatabase,
  p: NewProfile[],
  c: string[],
  e: Expense[],
): Promise<void> {
  db.withTransactionAsync(async () => {
    const profileNameIdMap: Map<string, number> = new Map();
    const categoryNameIdMap: Map<string, number> = new Map();
    p.forEach((p) => {
      const profileId = DBO.addProfile(db, p.name, p.currency);
      profileNameIdMap.set(p.name, profileId);
    });
    c.forEach((c) => {
      const categoryId = DBO.addCategory(db, c);
      categoryNameIdMap.set(c, categoryId);
    });
    const addExpensePromises: Promise<void>[] = [];
    e.forEach((e) => {
      if (e.profile_id === 0) e.profile_id = profileNameIdMap.get(e.profile_name) ?? 0;
      if (e.category_id === 0) e.category_id = categoryNameIdMap.get(e.category_name) ?? 0;
      addExpensePromises.push(
        DBO.addExpenseWithProfileIdAsync(
          db,
          e.price.toString(),
          e.category_id,
          e.date,
          e.profile_id,
          e.description,
        ),
      );
    });
    await Promise.all(addExpensePromises);
  });
}
