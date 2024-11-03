import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";
import * as Updates from "expo-updates";

export async function loadDatabase() {
  const dbName = "test.db";
  const dbAsset = require("../assets/test.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
      intermediates: true,
    });
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
}

export function getAllCategories(db: SQLite.SQLiteDatabase) {
  return db.getAllSync<Category>("SELECT * FROM categories");
}

export function addExpense(
  db: SQLite.SQLiteDatabase,
  price: string,
  categoryId: number,
  date: number,
  desc?: string,
) {
  const dateFormatted = new Date(date).toISOString();
  db.runSync(
    "INSERT INTO expenses (price, category_id, description,date) VALUES (?, ?, ?, ?)",
    parseFloat(price),
    categoryId,
    desc ?? null,
    dateFormatted,
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

export function getCategory(db: SQLite.SQLiteDatabase, name: string): Category {
  return db.getFirstSync("SELECT * FROM categories WHERE name = ?", name) as any;
}

export async function removeDatabase() {
  const sqlDir = FileSystem.documentDirectory + "SQLite/";
  await FileSystem.deleteAsync(sqlDir + "test.db", { idempotent: true });
}

export async function resetDatabase() {
  removeDatabase().then(() => loadDatabase().then(() => Updates.reloadAsync()));
}
