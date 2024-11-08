import { Pressable, StyleSheet, Text, View } from "react-native";
import * as DBController from "../../../controllers/database/DatabaseController";
import Toast from "react-native-toast-message";

const ImportDatabase = () => {
  const handlePress = async (importAction: () => Promise<void>) => {
    try {
      await importAction();
    } catch (e: any) {
      console.log(e);
      Toast.show({
        type: "error",
        text1: e.message,
      });
    }
  };

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
