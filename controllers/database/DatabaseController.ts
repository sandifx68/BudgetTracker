import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dbName = "test.db";
const sqlDir = FileSystem.documentDirectory + "SQLite/";

export async function loadDatabase() {
  const dbAsset = require(`../../assets/${dbName}`);
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = sqlDir + dbName;

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

export async function resetDatabase() {
  removeDatabase().then(() => loadDatabase().then(() => Updates.reloadAsync()));
}

export async function exportDatabase() {}
