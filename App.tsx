import "./gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { SQLiteProvider } from "expo-sqlite/next";
import Toast from "react-native-toast-message";
import ScreenList from "./components/ScreenList";

export default function App() {
  const db = "test.db";

  return (
    <>
      <NavigationContainer>
        <React.Suspense
          fallback={
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size={"large"} />
            </View>
          }
        >
          <SQLiteProvider
            databaseName={db}
            assetSource={{ assetId: require(`./assets/${db}`) }}
            useSuspense
          >
            <ScreenList />
          </SQLiteProvider>
        </React.Suspense>
      </NavigationContainer>
      <Toast />
    </>
  );
}
