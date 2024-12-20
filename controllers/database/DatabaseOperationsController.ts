import * as SQLite from "expo-sqlite";
import { SQLiteDatabase as SQLiteDB } from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function deleteGeneral(db: SQLiteDB, id: number, table: string) {
  db.runSync(`DELETE FROM ${table} WHERE id = ?`, id);
  if (table == "categories") {
    const unknownCategory = db.getFirstSync<{ id: number }>(
      "SELECT id FROM categories WHERE name = ?",
      "Unknown",
    );
    const unknownCategoryId = unknownCategory?.id ?? 4;
    db.runSync(`UPDATE expenses SET category_id = ? WHERE category_id = ?`, unknownCategoryId, id);
  }
}

export function getAllCategories(db: SQLiteDB) {
  return db.getAllSync<Category>("SELECT * FROM categories");
}

export function getCategoryByName(db: SQLiteDB, name: string): Category | null {
  const category = db.getFirstSync<Category>("SELECT * FROM categories WHERE name = ?", name);
  //if (!category) console.error(`No category with name ${name}.`);
  return category;
}

export async function getCategoryByNameAsync(db: SQLiteDB, name: string): Promise<Category | null> {
  return db.getFirstAsync<Category>("SELECT * FROM categories WHERE name = ?", name);
}

export function addCategory(db: SQLiteDB, name: string, image_id?: number, color?: string): number {
  return db.runSync(
    "INSERT INTO categories (name, image_id, color) VALUES (?,?,?)",
    name,
    image_id ?? 0, //default image
    color ?? "#964B00", //default brown color
  ).lastInsertRowId;
}

export function updateCategory(
  db: SQLiteDB,
  name: string,
  image_id: number,
  color: string,
  id: number,
) {
  db.runSync(
    "UPDATE categories SET name = ?, image_id = ?, color = ? WHERE id = ?",
    name,
    image_id,
    color,
    id,
  );
}

function getCategory(db: SQLiteDB, id: number): Category | null {
  const category = db.getFirstSync<Category>("SELECT * FROM categories WHERE id = ?", id);
  //if (!category) throw new Error(`No cateogry found with id ${id}.`);
  if (!category) console.error(`No cateogry found with id ${id}.`);
  return category;
}

export function getAllExpenses(db: SQLiteDB, profileId: number): Expense[] {
  return db
    .getAllSync<Expense>(
      "SELECT * FROM expenses WHERE profile_id = ? ORDER BY date DESC",
      profileId,
    )
    .map((e) => {
      const profile = getProfile(db, profileId);
      return {
        ...e,
        category_name: getCategory(db, e.category_id)?.name ?? "Uncategorized",
        profile_name: profile?.name ?? "",
        profile_currency: profile?.currency ?? "",
      };
    });
}

export function getCategoryMap(db: SQLiteDB): Map<number, string> {
  const allCategories = getAllCategories(db);
  return new Map(allCategories.map((category) => [category.id, category.name]));
}

export function getExpensesPerMonth(
  db: SQLiteDB,
  date: Date,
  profile: Profile,
  categoryMap: Map<number, string>,
): Expense[] {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString();
  return db
    .getAllSync<Expense>(
      "SELECT * FROM expenses WHERE profile_id = ? AND date BETWEEN ? AND ?",
      profile.id,
      startDate,
      endDate,
    )
    .map((e) => ({
      ...e,
      category_name: categoryMap.get(e.category_id) ?? "Uncategorized",
      profile_name: profile.name ?? "",
      profile_currency: profile.currency ?? "€",
    }));
}

export function getExpenseSumPerMonth(db: SQLiteDB, date: Date, profile_id: number): number {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString();
  const result = db.getFirstSync<{ total_expense: number }>(
    "SELECT SUM(price) AS total_expense FROM expenses WHERE profile_id = ? AND date BETWEEN ? AND ?",
    profile_id,
    startDate,
    endDate,
  );
  return result?.total_expense ?? 0;
}

export function addExpense(
  db: SQLiteDB,
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

export async function addExpenseWithProfileIdAsync(
  db: SQLiteDB,
  price: string,
  categoryId: number,
  date: number,
  profileId: number,
  desc?: string,
) {
  const dateFormatted = new Date(date).toISOString();
  db.runAsync(
    "INSERT INTO expenses (price, category_id, description,date,profile_id) VALUES (?, ?, ?, ?,?)",
    parseFloat(price),
    categoryId,
    desc ?? null,
    dateFormatted,
    profileId,
  );
}

export function updateExpense(
  db: SQLiteDB,
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

export function profileExists(db: SQLiteDB, name: string): boolean {
  return db.getFirstSync<Profile>("SELECT * FROM profiles WHERE name = ?", name) != null;
}

export function getProfile(db: SQLiteDB, id: number): Profile | null {
  const profile = db.getFirstSync<Profile>("SELECT * FROM profiles WHERE id = ?", id);
  if (!profile) console.error(`No profile with id ${id} exists.`);
  return profile;
}

export async function getProfileByNameAsync(db: SQLiteDB, name: string): Promise<Profile | null> {
  return db.getFirstAsync<Profile>("SELECT * FROM profiles WHERE name = ?", name);
}

export function addProfile(db: SQLiteDB, name: string, currency: string): number {
  return db.runSync("INSERT INTO profiles (name, currency) VALUES (?, ?)", name, currency)
    .lastInsertRowId;
}

export function updateProfile(db: SQLiteDB, id: number, name: string, currency: string) {
  db.runSync("UPDATE profiles SET name = ?, currency = ? WHERE id = ?", name, currency, id);
}

export async function deleteProfile(db: SQLiteDB, id: number) {
  db.withTransactionAsync(async () => {
    db.runSync("DELETE FROM profiles WHERE id = ?", id);
    db.runAsync("DELETE FROM expenses WHERE profile_id = ?", id);
  });
}

export function getAllProfiles(db: SQLiteDB): Profile[] {
  return db.getAllSync<Profile>("SELECT * FROM profiles");
}

export async function initializeProfile(): Promise<number> {
  try {
    const currentProfile = await AsyncStorage.getItem("current_profile");
    if (currentProfile === null) {
      // If "current_profile" is not set, initialize it
      await AsyncStorage.setItem("current_profile", "6");
      console.log("current_profile set to default profile");
      return 6;
    }
    return parseInt(currentProfile);
  } catch (error) {
    console.error("Error initializing profile:", error);
  }
  return -1;
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
