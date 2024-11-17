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
import { useSQLiteContext } from "expo-sqlite";
import * as DBOController from "../../../controllers/database/DatabaseOperationsController";
import Toast from "react-native-toast-message";
import DatePicker from "react-native-date-picker";
import PressableListItem from "../../PressableListItem";
import { Animated } from "react-native";
import { useTheme } from "@react-navigation/native";
import Color, { rgb } from "color";

export function AddExpense({ route, navigation }: any) {
  const initialExpense: Expense = route.params?.expense;
  const [price, setPrice] = React.useState<string>(initialExpense?.price.toString());
  const [description, setDescription] = React.useState<string>(initialExpense?.description);
  const [date, setDate] = React.useState<number>(initialExpense?.date ?? Date.now()); //Stored as unixepoch
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [open, setOpen] = React.useState(false);
  const [batchAdd, setBatchAdd] = React.useState(false);
  const toggleAnimation = React.useRef(new Animated.Value(0)).current;
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const fadedText = Color(colors.text).alpha(0.68).rgb().string();
  const inputText = [
    styles.input,
    { backgroundColor: colors.card, borderColor: colors.notification, color: colors.text },
  ];

  React.useEffect(() => {
    const fetchData = () => {
      setPrice(initialExpense?.price.toString());
      setDescription(initialExpense?.description);
      setDate(initialExpense?.date ?? Date.now());
      let allCategories = DBOController.getAllCategories(db);
      const initialCategoryId = route.params?.selectedCategoryId;
      if (initialCategoryId)
        // if we are adding a specific category from chart
        allCategories = allCategories.map((c) =>
          initialCategoryId == c.id ? { ...c, is_selected: true } : c,
        );
      else
        allCategories = allCategories.map((c) =>
          initialExpense?.category_id == c.id ? { ...c, is_selected: true } : c,
        );
      setCategories(allCategories);
    };
    fetchData();
  }, [route]);

  const resetFields = () => {
    setPrice("");
    setDescription("");
    setCategories(categories.map((c) => ({ ...c, is_selected: false })));
  };

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
        DBOController.addExpense(db, price, categoryId, date, description);
        Toast.show({
          type: "success",
          text1: "Expense successfully added!",
        });
      } else {
        DBOController.updateExpense(db, initialExpense.id, price, categoryId, date, description);
        Toast.show({
          type: "info",
          text1: "Expense successfully modified!",
        });
      }
      if (!batchAdd) {
        setTimeout(() => {
          navigation.navigate("Expense List");
        }, 10); // Reroute to the main screen after delay to avoid race condition
      } else {
        resetFields();
      }
    }
  };

  const toggleBatchAdd = () => {
    Animated.timing(toggleAnimation, {
      toValue: batchAdd ? 0 : 1, // Switch between 0 and 1
      duration: 300,
      useNativeDriver: false,
    }).start();
    setBatchAdd((prev) => !prev);
  };

  const animatedBackgroundColor = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.notification], // Blue to teal
  });

  const selectItem = (item: Category) => {
    setCategories(
      categories.map((i) => {
        i.is_selected = i.id == item.id ? !item.is_selected : false;
        return i;
      }),
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Add a new expense */}
      <Pressable
        style={[
          styles.dateWrapper,
          { backgroundColor: colors.card, borderColor: colors.notification },
        ]}
        onPress={() => setOpen(true)}
      >
        {/* We only care about the date, the time is useless */}
        <Text style={[styles.dateText, { color: colors.text }]}>
          {new Date(date).toDateString()}
        </Text>
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
          style={inputText}
          placeholderTextColor={fadedText}
          placeholder={"Cost"}
          keyboardType="numeric"
          value={price}
          onChangeText={(value) => {
            setPrice(value);
          }}
        />

        <TextInput
          style={inputText}
          placeholderTextColor={fadedText}
          placeholder={"Description"}
          value={description?.toString()}
          onChangeText={(value) => setDescription(value)}
        />
      </KeyboardAvoidingView>

      <View
        style={[
          styles.categoriesWrapper,
          { backgroundColor: colors.card, borderColor: colors.notification },
        ]}
      >
        <FlatList
          data={categories}
          renderItem={({ item }) => {
            if (item.name != "Unknown")
              return (
                <PressableListItem
                  selected={item.is_selected}
                  name={item.name}
                  selectThis={() => selectItem(item)}
                />
              );
            return null;
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {initialExpense === undefined && (
        <Animated.View
          style={[styles.batchAddWrapper, { backgroundColor: animatedBackgroundColor }]}
        >
          <Pressable onPress={toggleBatchAdd}>
            <Text style={[styles.batchAddText, { color: colors.text }]}>
              {batchAdd ? "Batch Add Enabled" : "Enable Batch Add"}
            </Text>
          </Pressable>
        </Animated.View>
      )}

      <View style={styles.addExpenseButtonWrapper}>
        <Pressable onPress={() => handleAddExpense()}>
          <View
            style={[
              styles.addWrapper,
              { backgroundColor: colors.card, borderColor: colors.notification },
            ]}
          >
            <Text style={[styles.addText, { color: colors.text }]}>
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
    paddingTop: 60,
    flex: 1,
  },
  dateText: {
    textAlign: "center",
  },
  dateWrapper: {
    borderRadius: 10,
    borderWidth: 2,
    width: "30%",
  },
  input: {
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 60,
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
    height: "50%",
  },
  addExpenseButtonWrapper: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  addText: {
    textAlign: "center",
  },
  addWrapper: {
    width: 80,
    height: 80,
    borderWidth: 3,
    //borderColor: "red",
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    backgroundColor: "#FFF",
  },
  batchAddWrapper: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  batchAddText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
