import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import * as DBController from "../../../controllers/database/DatabaseController";
import Toast from "react-native-toast-message";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";

const ImportDatabase = () => {
  const db = useSQLiteContext();
  const [loading, setLoading] = React.useState<boolean>(false);

  const handlePress = async (importAction: (db?: any) => Promise<void>) => {
    try {
      setLoading(true);
      if (importAction.length === 1) {
        await importAction(db);
      } else {
        await importAction();
      }
      Toast.show({
        type: "success",
        text1: "Database imported successfully!",
      });
    } catch (e: any) {
      console.log(e);
      Toast.show({
        type: "error",
        text1: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.addWrapper}>
        <Pressable onPress={() => handlePress(DBController.importDatabase)}>
          <Text style={styles.textStyle}>Import .db</Text>
        </Pressable>
      </View>
      <View style={styles.addWrapper}>
        <Pressable onPress={() => handlePress(DBController.importDatabaseCsv)}>
          <Text style={styles.textStyle}>Import csv</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center" },
  addWrapper: {
    width: 60,
    height: 60,
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    textAlign: "center",
  },
});

export default ImportDatabase;
