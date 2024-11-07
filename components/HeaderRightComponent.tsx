import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { Pressable, Text } from "react-native";

interface Props {
  itemId: any;
  itemName: string;
  tableName: string;
  screenName: string;
}

export function HeaderRightComponent(props: Props): React.JSX.Element | undefined {
  const db = useSQLiteContext();
  const navigation: any = useNavigation();

  const deleteItem = () => {
    db.runSync(`DELETE FROM ${props.tableName} WHERE id = ?`, props.itemId);
    navigation.navigate(props.screenName);
  };

  if (props.itemId)
    return (
      <Pressable onPress={() => deleteItem()}>
        <Text>Delete {props.itemName}.</Text>
      </Pressable>
    );
}
