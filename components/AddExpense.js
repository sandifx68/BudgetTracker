import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ExpenseCategory from "./ExpenseCategory";
import { useNavigation } from "@react-navigation/native";

class Category {
  constructor(name, id) {
    this.id = id;
    this.name = name;
  }
}

class Expense {
  constructor(price, category, description) {
    this.price = price;
    this.category = category;
    this.description = description;
  }
  isSelected = false;
}

const categories = [new Category("On the go food", 1), new Category("Cooking", 2)];
const expenses = [
  new Expense(2.0, new Category("On the go food"), null),
  new Expense(3.0, new Category("Cooking"), null),
];

export default class AddExpense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: [],
      cost: 0.0,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ loading: true });

    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson = responseJson.map((item) => {
          item.name = item.title.split(" ")[0];
          item.isSelected = false;
          delete item["albumId"];
          delete item["thumbnailUrl"];
          delete item["title"];
          delete item["url"];

          return item;
        });
        responseJson = responseJson.slice(0, 5);
        this.setState({
          loading: false,
          dataSource: responseJson.slice(0, 5),
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  selectItem = (item) => {
    this.state.dataSource = this.state.dataSource.map((i) => {
      i.isSelected = i.id == item.id ? !item.isSelected : false;
      return i;
    });

    //(this.state.dataSource.map((i) => i.isSelected));

    this.setState({
      dataSource: this.state.dataSource,
    });
  };

  handleAddExpense = () => {
    console.log(
      this.state.cost,
      this.state.dataSource.find((i) => i.isSelected == true),
    );
    this.props.navigation.navigate("ExpenseList");
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="purple" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Add a new expense */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          // style={styles.writeExpenseWrapper}
        >
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={"Cost"}
            value={this.state.cost}
            onChangeText={(value) => (this.state.cost = value)}
          />
        </KeyboardAvoidingView>

        <View style={styles.categoriesWrapper}>
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <ExpenseCategory category={item} selectThis={() => this.selectItem(item)} />
            )}
            keyExtractor={(item) => item.id.toString()}
            extraData={this.state}
          />
        </View>

        <View style={styles.addExpenseButtonWrapper}>
          <TouchableOpacity onPress={() => this.handleAddExpense()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}> Add expense! </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
