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
import * as DBOController from "../../../controllers/database/DatabaseOperationsController";
import Toast from "react-native-toast-message";
import { useTheme } from "@react-navigation/native";

export function AddProfile({ route, navigation }: any) {
  let initialProfile: Profile = route.params?.profile;
  const [name, setName] = React.useState<string>(initialProfile?.name);
  const [currency, setCurrency] = React.useState<string>(initialProfile?.currency);
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const textInputStyle = [
    styles.input,
    { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
  ];

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
    } else if (name !== initialProfile?.name && DBOController.profileExists(db, name)) {
      Toast.show({
        type: "error",
        text1: "Profile name already exists!",
      });
    } else {
      if (!initialProfile?.name) {
        DBOController.addProfile(db, name, currency);
        Toast.show({
          type: "success",
          text1: "Profile successfully added!",
        });
      } else {
        DBOController.updateProfile(db, initialProfile?.id, name, currency);
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
          style={textInputStyle}
          placeholder={"Profile name"}
          placeholderTextColor={colors.text}
          value={name}
          onChangeText={(value) => {
            setName(value);
          }}
        />

        <TextInput
          style={textInputStyle}
          placeholder={"Currency"}
          placeholderTextColor={colors.text}
          value={currency}
          onChangeText={(value) => setCurrency(value)}
        />
      </KeyboardAvoidingView>

      <View style={styles.addProfileButtonWrapper}>
        <Pressable onPress={() => handleAddProfile()}>
          <View
            style={[
              styles.addWrapper,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.addText, { color: colors.text }]}>
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
    paddingTop: 60,
    flex: 1,
  },
  input: {
    paddingVertical: 15,
    marginTop: 10,
    paddingHorizontal: 15,
    borderRadius: 60,
    borderWidth: 2,
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
    fontSize: 24,
  },
  addWrapper: {
    width: 90,
    height: 90,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 3,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
