import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import MonthSortedExpenses from "./MonthSortedExpenses";
import { useNavigation, useTheme } from "@react-navigation/native";
import * as DBO from "../../../controllers/database/DatabaseOperationsController";
import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";
import { useSQLiteContext } from "expo-sqlite";

export function ExpenseList({ route }: any): React.JSX.Element {
  const [profile, setProfile] = React.useState<Profile>();
  const navigation: any = useNavigation();
  const db: SQLiteAnyDatabase = useSQLiteContext();
  const { colors } = useTheme();

  const fetchProfile = async () => {
    const fetchedProfile = await DBO.getCurrentProfileId().then((id) => DBO.getProfile(db, id));
    if (fetchedProfile) setProfile(fetchedProfile);
  };

  // When we load the app, we want to fetch the profile
  React.useEffect(() => {
    fetchProfile();
  }, []);

  // Every time we switch profile
  React.useEffect(() => {
    if (route.params?.profileChanged === true) {
      navigation.setParams({ profileChanged: false });
      fetchProfile();
    }
  }, [route.params?.profileChanged]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* List all expenses */}
      <View style={[styles.expensesWrapper, { borderColor: colors.border }]}>
        <MonthSortedExpenses profile={profile} />
      </View>

      {/* Button to add a new expense */}
      <View style={styles.addExpenseWrapper}>
        <Pressable onPress={() => navigation.navigate("Add Expense")}>
          <View style={[styles.buttonWrapper, { backgroundColor: colors.card }]}>
            <Text style={[styles.plusText, { color: colors.text }]}> + </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
  expensesWrapper: {
    paddingHorizontal: 20,
    marginTop: 15,
    height: "80%",
  },
  addExpenseWrapper: {
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    width: 90,
    height: 90,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 48,
    fontWeight: "500",
  },
});
