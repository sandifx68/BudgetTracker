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
import { useTheme } from "@react-navigation/native";

interface labelValue {
  label: string;
  value: string;
}

const imageGridBorderWidth = 5;
const colorOptions: labelValue[] = [
  { label: "Red", value: "#FF0000" },
  { label: "Light Red", value: "#F68685" },
  { label: "Pink", value: "#F78CB8" },
  { label: "Orange", value: "#FFA500" },
  { label: "Yellow", value: "#FFD974" },
  { label: "Dark Yellow", value: "#DAC365" },
  { label: "Lime Green", value: "#A2D6B2" },
  { label: "Green", value: "#00FF00" },
  { label: "Cyan", value: "#01CED3" },
  { label: "Light Blue", value: "#7B879D" },
  { label: "Blue", value: "#0000FF" },
  { label: "Dark Blue", value: "#596FB8" },
  { label: "Purple", value: "#800080" },
  { label: "Light Purple", value: "#D6C1C8" },
  { label: "Brown", value: "#964B00" },
];

export function AddCategory({ route, navigation }: any): React.JSX.Element {
  const intitialCategory = route.params?.category;
  const [category, setCategory] = React.useState<Category>();
  const [imageGridWidth, setImageGridWidth] = React.useState<number>();
  const [selectedColor, setSelectedColor] = React.useState<string>("#964B00");
  const [open, setOpen] = React.useState(false);
  const [imageUris, setImageUris] = React.useState<string[]>([]);
  const imagesPerRow = 3;
  const db = useSQLiteContext();
  const { colors } = useTheme();

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
          fill={index == category?.image_id ? selectedColor : colors.text}
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
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
          ]}
          placeholderTextColor={colors.text}
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
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          textStyle={{ color: selectedColor }}
          value={selectedColor}
          items={colorOptions.map((v) => {
            return { ...v, labelStyle: { color: v.value } };
          })}
          setOpen={setOpen}
          setValue={setSelectedColor}
        />
      </View>

      <View
        style={[
          styles.imageGridWrapper,
          { borderColor: colors.border, backgroundColor: colors.card },
        ]}
        onLayout={onLayout}
      >
        <FlatList
          data={imageUris}
          renderItem={({ item, index }) => renderImage(index, item)}
          numColumns={imagesPerRow}
        />
      </View>

      <View style={styles.addCategoryButtonWrapper}>
        <Pressable onPress={() => handleAddCategory()}>
          <View
            style={[
              styles.addWrapper,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.addText, { color: colors.text }]}>
              {" "}
              {!intitialCategory ? "Add Category!" : "Modify Category!"}{" "}
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
    fontSize: 18,
  },
  addWrapper: {
    width: 90,
    height: 90,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 3,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  imageGridWrapper: {
    marginTop: 15,
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
