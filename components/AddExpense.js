import React from "react";
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
import * as SQLite from "expo-sqlite";

//Might not be a good idea
const db = SQLite.openDatabaseSync("database.db");

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

    const result = db.getAllSync("SELECT * FROM categories");

    this.setState({
      loading: false,
      dataSource: result,
    });
  };

  selectItem = (item) => {
    this.state.dataSource = this.state.dataSource.map((i) => {
      i.isSelected = i.id == item.id ? !item.isSelected : false;
      return i;
    });

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
