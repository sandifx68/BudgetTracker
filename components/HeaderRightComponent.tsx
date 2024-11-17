import { useNavigation, useTheme } from "@react-navigation/native";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Alert, Pressable, Text } from "react-native";
import Toast from "react-native-toast-message";
import * as DBO from "../controllers/database/DatabaseOperationsController";

interface Props {
  itemId: any;
  itemName: string;
  tableName: string;
  screenName: string;
  serious?: boolean;
  seriousMessage?: string;
  deleteItem?: (db: SQLiteDatabase, id: number) => void;
}

export function HeaderRightComponent(props: Props): React.JSX.Element | undefined {
  const db = useSQLiteContext();
  const navigation: any = useNavigation();
  const { colors } = useTheme();

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const showSuccessMessage = () =>
    Toast.show({
      type: "success",
      text1: `${capitalizeFirstLetter(props.itemName)} deleted successfully!`,
    });

  const alertFilter = (action: () => void) => {
    Alert.alert(
      "Are you sure?",
      props.seriousMessage,
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            action();
            showSuccessMessage();
            navigation.navigate(props.screenName);
          },
        },
      ],
      { cancelable: false },
    );
  };

  const deleteItem = () => {
    try {
      const deleteAction = () =>
        props.deleteItem
          ? props.deleteItem(db, props.itemId)
          : DBO.deleteGeneral(db, props.itemId, props.tableName);
      if (props.serious) {
        alertFilter(deleteAction);
      } else {
        deleteAction();
        showSuccessMessage();
        navigation.navigate(props.screenName);
      }
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
        <Text style={{ color: colors.text }}>Delete {props.itemName}.</Text>
      </Pressable>
    );
}
