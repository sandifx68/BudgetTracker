import { Pressable, StyleSheet, Text, View } from "react-native";
import * as DBController from "../../../controllers/database/DatabaseController";

const ExportDatabase = () => {
  return (
    <View style={styles.container}>
      <View style={styles.addWrapper}>
        <Pressable onPress={() => DBController.exportDatabase()}>
          <Text style={styles.textStyle}>Export database!</Text>
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

export default ExportDatabase;
