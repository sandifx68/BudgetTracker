import { View, Text, StyleSheet } from "react-native";

interface Props {
  month: number;
  expenses: Expense[];
  width: number;
}

const ChartExpenses = ({ month, expenses, width }: Props): React.JSX.Element => {
  return (
    <View style={{ width: width }}>
      <Text>Chart</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChartExpenses;
