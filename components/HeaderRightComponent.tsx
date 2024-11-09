import { useNavigation } from "@react-navigation/native";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Pressable, Text } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  itemId: any;
  itemName: string;
  tableName: string;
  screenName: string;
  deleteItem?: (db: SQLiteDatabase, id: number) => void;
}

export function HeaderRightComponent(props: Props): React.JSX.Element | undefined {
  const db = useSQLiteContext();
  const navigation: any = useNavigation();

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const deleteItem = () => {
    try {
      if (props.deleteItem) props.deleteItem(db, props.itemId);
      else db.runSync(`DELETE FROM ${props.tableName} WHERE id = ?`, props.itemId);
      Toast.show({
        type: "success",
        text1: `${capitalizeFirstLetter(props.itemName)} deleted successfully!`,
      });
      navigation.navigate(props.screenName);
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: e.message,
      });
    }
  };

  if (props.itemId)
    return (
      <Pressable onPress={() => deleteItem()}>
        <Text>Delete {props.itemName}.</Text>
      </Pressable>
    );
}
