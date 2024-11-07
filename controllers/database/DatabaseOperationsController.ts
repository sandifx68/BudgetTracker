import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function getAllCategories(db: SQLite.SQLiteDatabase) {
  return db.getAllSync<Category>("SELECT * FROM categories");
}

export function getCategory(db: SQLite.SQLiteDatabase, name: string): Category {
  return db.getFirstSync("SELECT * FROM categories WHERE name = ?", name) as any;
}

export function getAllExpenses(db: SQLite.SQLiteDatabase, profileId: number): Expense[] {
  return db.getAllSync<Expense>(
    "SELECT * FROM expenses WHERE profile_id = ? ORDER BY date DESC",
    profileId,
  );
}

export function addExpense(
  db: SQLite.SQLiteDatabase,
  price: string,
  categoryId: number,
  date: number,
  desc?: string,
) {
  const dateFormatted = new Date(date).toISOString();
  getCurrentProfileId().then((profileId) =>
    db.runSync(
      "INSERT INTO expenses (price, category_id, description,date,profile_id) VALUES (?, ?, ?, ?,?)",
      parseFloat(price),
      categoryId,
      desc ?? null,
      dateFormatted,
      profileId,
    ),
  );
}

export function updateExpense(
  db: SQLite.SQLiteDatabase,
  id: number,
  price: string,
  catId: number,
  date: number,
  desc?: string,
) {
  const dateFormatted = new Date(date).toISOString();
  db.runSync(
    "UPDATE expenses SET price = ?, category_id = ?, description = ?, date = ? WHERE id = ?",
    parseFloat(price),
    catId,
    desc ?? null,
    dateFormatted,
    id,
  );
}

export function profileExists(db: SQLite.SQLiteDatabase, name: string): boolean {
  return db.getFirstSync<Profile>("SELECT * FROM profiles WHERE name = ?", name) != null;
}

export function getProfile(db: SQLite.SQLiteDatabase, id: number): Profile | null {
  return db.getFirstSync<Profile>("SELECT * FROM profiles WHERE id = ?", id);
}

export function addProfile(db: SQLite.SQLiteDatabase, name: string, currency: string) {
  db.runSync("INSERT INTO profiles (name, currency) VALUES (?, ?)", name, currency);
}

export function updateProfile(
  db: SQLite.SQLiteDatabase,
  id: number,
  name: string,
  currency: string,
) {
  db.runSync("UPDATE profiles SET name = ?, currency = ? WHERE id = ?", name, currency, id);
}

export function getAllProfiles(db: SQLite.SQLiteDatabase): Profile[] {
  return db.getAllSync<Profile>("SELECT * FROM profiles");
}

export async function initializeProfile() {
  try {
    const currentProfile = await AsyncStorage.getItem("current_profile");
    if (currentProfile === null) {
      // If "current_profile" is not set, initialize it
      await AsyncStorage.setItem("current_profile", "1");
      console.log("current_profile set to default profile");
    }
  } catch (error) {
    console.error("Error initializing profile:", error);
  }
}

export async function getCurrentProfileId(): Promise<number> {
  try {
    const currentProfileId = await AsyncStorage.getItem("current_profile");
    return parseInt(currentProfileId ?? "-1");
  } catch (error) {
    console.error("Error retrieving current profile:", error);
    return -1;
  }
}

export async function switchCurrentProfile(newProfileId: number) {
  try {
    await AsyncStorage.setItem("current_profile", newProfileId.toString());
    console.log(`Current profile switched to: ${newProfileId}`);
  } catch (error) {
    console.error("Error switching profile:", error);
  }
}
