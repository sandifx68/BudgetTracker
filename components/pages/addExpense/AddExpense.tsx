import React from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import ExpenseCategoryComponent from "../../ExpenseCategoryComponent";
import { useSQLiteContext } from "expo-sqlite";
import * as DBController from "../../DatabaseController";
import Toast from "react-native-toast-message";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "@react-navigation/native";

export function HeaderRightComponentAddExpense({ expense }: any): React.JSX.Element | undefined {
  const db = useSQLiteContext();
  const navigation: any = useNavigation();

  const deleteExpense = () => {
    db.runSync("DELETE FROM expenses WHERE id = ?", expense.id);
    navigation.navigate("Expense List");
  };

  if (expense)
    return (
      <Pressable onPress={() => deleteExpense()}>
        {/* <Image source={require('./assets/trash.jpg')} style={{height: 'auto', width: 'auto'}}/> */}
        <Text>Delete expense.</Text>
      </Pressable>
    );
}

export function AddExpense({ route, navigation }: any) {
  let initialExpense: Expense = route.params?.expense;
  const [price, setPrice] = React.useState<string>(initialExpense?.price.toString());
  const [description, setDescription] = React.useState<string>(initialExpense?.description);
  const [date, setDate] = React.useState<number>(initialExpense?.date ?? Date.now()); //Stored as unixepoch
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [open, setOpen] = React.useState(false);
  const db = useSQLiteContext();

  React.useEffect(() => {
    const fetchData = () => {
      setPrice(initialExpense?.price.toString());
      setDescription(initialExpense?.description);
      setDate(initialExpense?.date ?? Date.now());
      let allCategories = DBController.getAllCategories(db);
      allCategories = allCategories.map((c) =>
        initialExpense?.category_id == c.id ? { ...c, is_selected: true } : c,
      );
      setCategories(allCategories);
    };
    fetchData();
  }, [route]);

  const handleAddExpense = () => {
    const categoryId = categories.find((i) => i.is_selected == true)?.id;
    if (!price || Number.isNaN(price)) {
      Toast.show({
        type: "error",
        text1: "No price specified!",
      });
    } else if (!categoryId) {
      Toast.show({
        type: "error",
        text1: "No category specified!",
      });
    } else {
      if (!initialExpense?.id) {
        DBController.addExpense(db, price, categoryId, date, description);
        Toast.show({
          type: "success",
          text1: "Expense successfully added!",
        });
      } else {
        DBController.updateExpense(db, initialExpense.id, price, categoryId, date, description);
        Toast.show({
          type: "info",
          text1: "Expense successfully modified!",
        });
      }
      navigation.navigate("Expense List");
    }
  };

  const selectItem = (item: Category) => {
    setCategories(
      categories.map((i) => {
        i.is_selected = i.id == item.id ? !item.is_selected : false;
        return i;
      }),
    );
  };

  return (
    <View style={styles.container}>
      {/* Add a new expense */}
      <Pressable style={styles.dateWrapper} onPress={() => setOpen(true)}>
        {/* We only care about the date, the time is useless */}
        <Text style={styles.dateText}>{new Date(date).toDateString()}</Text>
      </Pressable>
      <DatePicker
        modal
        mode="date"
        locale="en-GB"
        open={open}
        date={new Date(date)}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date.valueOf());
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder={"Cost"}
          value={price}
          onChangeText={(value) => {
            setPrice(value);
          }}
        />

        <TextInput
          style={styles.input}
          placeholder={"Description"}
          value={description?.toString()}
          onChangeText={(value) => setDescription(value)}
        />
      </KeyboardAvoidingView>

      <View style={styles.categoriesWrapper}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <ExpenseCategoryComponent category={item} selectThis={() => selectItem(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <View style={styles.addExpenseButtonWrapper}>
        <Pressable onPress={() => handleAddExpense()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>
              {!initialExpense ? "Add expense!" : "Modify Expense!"}
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
  dateText: {
    textAlign: "center",
  },
  dateWrapper: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    width: "30%",
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
  categoriesWrapper: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 15,
    backgroundColor: "#FFF",
    borderRadius: 30,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
    height: 250,
  },
  addExpenseButtonWrapper: {
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
  list: {
    backgroundColor: "#FFF",
  },
});
