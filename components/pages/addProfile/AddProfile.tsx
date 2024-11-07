import React from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import * as DBController from "../../DatabaseController";
import Toast from "react-native-toast-message";

export function AddProfile({ route, navigation }: any) {
  let initialProfile: Profile = route.params?.profile;
  const [name, setName] = React.useState<string>(initialProfile?.name);
  const [currency, setCurrency] = React.useState<string>(initialProfile?.currency);
  const db = useSQLiteContext();

  React.useEffect(() => {
    const fetchData = () => {
      setName(initialProfile?.name);
      setCurrency(initialProfile?.currency);
    };
    fetchData();
  }, [route]);

  const handleAddProfile = () => {
    if (!name) {
      Toast.show({
        type: "error",
        text1: "No profile name specified!",
      });
    } else if (!currency) {
      Toast.show({
        type: "error",
        text1: "No currency specified!",
      });
    } else if (name !== initialProfile?.name && DBController.profileExists(db, name)) {
      Toast.show({
        type: "error",
        text1: "Profile name already exists!",
      });
    } else {
      if (!initialProfile?.name) {
        DBController.addProfile(db, name, currency);
        Toast.show({
          type: "success",
          text1: "Profile successfully added!",
        });
      } else {
        DBController.updateProfile(db, initialProfile?.id, name, currency);
        Toast.show({
          type: "info",
          text1: "Profile successfully modified!",
        });
      }
      navigation.navigate("Expense List");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          style={styles.input}
          placeholder={"Profile name"}
          value={name}
          onChangeText={(value) => {
            setName(value);
          }}
        />

        <TextInput
          style={styles.input}
          placeholder={"Currency"}
          value={currency}
          onChangeText={(value) => setCurrency(value)}
        />
      </KeyboardAvoidingView>

      <View style={styles.addProfileButtonWrapper}>
        <Pressable onPress={() => handleAddProfile()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>
              {!initialProfile ? "Add profile!" : "Modify profile!"}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#E8EAED",
    paddingTop: 60,
    flex: 1,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addProfileButtonWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  addText: {
    textAlign: "center",
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
