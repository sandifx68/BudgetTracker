import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as Updates from "expo-updates";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";

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

export async function importDatabaseCsv() {
  const uri = await validateFileAndExtractUri("text/csv", ".csv");
  const fileContents = await FileSystem.readAsStringAsync(uri);
  const parsedData = Papa.parse<Line>(fileContents, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  console.log(parsedData.data[0]);
}
