import React from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  LayoutChangeEvent,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import Toast from "react-native-toast-message";
import { FlatList, TextInput } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import * as DBO from "../../../controllers/database/DatabaseOperationsController";
import * as DB from "../../../controllers/database/DatabaseController";
import { SvgUri } from "react-native-svg";

interface labelValue {
  label: string;
  value: string;
}

const imageGridBorderWidth = 5;
const colorOptions: labelValue[] = [
  { label: "Red", value: "#FF0000" },
  { label: "Green", value: "#00FF00" },
  { label: "Blue", value: "#0000FF" },
  { label: "Yellow", value: "#FFFF00" },
  { label: "Purple", value: "#800080" },
  { label: "Orange", value: "#FFA500" },
  { label: "Black", value: "#000000" },
  { label: "White", value: "#FFFFFF" },
];

export function AddCategory({ route, navigation }: any): React.JSX.Element {
  const db = useSQLiteContext();
  const intitialCategory = route.params?.category;
  const [category, setCategory] = React.useState<Category>();
  const [imageGridWidth, setImageGridWidth] = React.useState<number>();
  const [selectedColor, setSelectedColor] = React.useState<string>("#FF0000");
  const [open, setOpen] = React.useState(false);
  const [imageUris, setImageUris] = React.useState<string[]>([]);
  const imagesPerRow = 3;

  const refresh = async () => {
    setCategory(intitialCategory);
    if (intitialCategory) setSelectedColor(intitialCategory.color);
    setImageUris(await DB.getImageUris());
  };

  React.useEffect(() => {
    refresh();
  }, [route]);

  const handleAddCategory = () => {
    if (category?.name) {
      if (!category.id) {
        DBO.addCategory(db, category.name, category.image_id, selectedColor);
        Toast.show({
          type: "success",
          text1: "Category successfully added!",
        });
      } else {
        DBO.updateCategory(db, category.name, category.image_id, selectedColor, category.id);
        Toast.show({
          type: "info",
          text1: "Category successfully modified!",
        });
      }
      navigation.navigate("Expense List");
    } else {
      Toast.show({
        type: "error",
        text1: "Category name can't be empty!",
      });
    }
  };

  const setCategoryImage = (imageNumber: number) => {
    setCategory({ ...(category as Category), image_id: imageNumber });
  };

  const handleAddImage = async () => {
    try {
      await DB.uploadImage();
      await refresh();
      Toast.show({
        type: "success",
        text1: "Category image successfully uploaded!",
      });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: e.message,
      });
    }
  };

  const renderImage = (index: number, uri: string) => {
    if (imageGridWidth) {
      const sizePerItem = imageGridWidth / imagesPerRow;
      return (
        <SvgUri
          uri={uri}
          height={sizePerItem}
          width={sizePerItem}
          fill={index == category?.image_id ? selectedColor : "#000000"}
          onPress={() => (uri == DB.plusIconPhoneUri ? handleAddImage() : setCategoryImage(index))}
        />
      );
    }
    return null;
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const onLayoutWidth = event.nativeEvent.layout.width;

    if (onLayoutWidth > 0 && imageGridWidth !== onLayoutWidth) {
      setImageGridWidth(onLayoutWidth - imageGridBorderWidth * 2);
    }
  };

  return (
    <View style={styles.container}>
      {/* Add a new category */}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          style={styles.input}
          placeholder={"Category name"}
          value={category?.name}
          onChangeText={(value) => setCategory({ ...(category as Category), name: value })}
        />
      </KeyboardAvoidingView>

      <View style={styles.dropDownWraper}>
        <DropDownPicker
          open={open}
          translation={{
            PLACEHOLDER: "Select a color",
          }}
          value={selectedColor}
          items={colorOptions.map((v) => {
            return { ...v, labelStyle: { color: v.value } };
          })}
          setOpen={setOpen}
          setValue={setSelectedColor}
        />
      </View>

      <View style={styles.addCategoryButtonWrapper}>
        <Pressable onPress={() => handleAddCategory()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>
              {" "}
              {!intitialCategory ? "Add Category!" : "Modify Category!"}{" "}
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.imageGridWrapper} onLayout={onLayout}>
        <FlatList
          data={imageUris}
          renderItem={({ item, index }) => renderImage(index, item)}
          numColumns={imagesPerRow}
        />
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
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addCategoryButtonWrapper: {
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
  imageGridWrapper: {
    marginTop: 15,
    borderColor: "dimgray",
    borderWidth: imageGridBorderWidth,
    borderRadius: 10,
    height: "50%",
    width: "80%",
  },
  dropDownWraper: {
    marginTop: 15,
    width: "80%",
  },
});
