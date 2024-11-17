import "./gesture-handler";
import * as React from "react";
import { DarkTheme, DefaultTheme, NavigationContainer, Theme } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { SQLiteProvider } from "expo-sqlite/next";
import Toast from "react-native-toast-message";
import ScreenList from "./components/ScreenList";
import { initializeProfile } from "./controllers/database/DatabaseOperationsController";
import { downloadImages } from "./controllers/database/DatabaseController";
import { imageDataSvg } from "./assets/categoryImages/imageData";

const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#1E2A38",
    primary: "#9b59b6",
    text: "#D1D5DB",
    border: "#006666",
    card: "#2A3B4D",
    notification: "#ab20fd",
  },
};

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const db = "test.db";
  const LoadingIndication = (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  );

  React.useEffect(() => {
    const initialize = async () => {
      await Promise.all([downloadImages(imageDataSvg), initializeProfile()]);
      setIsLoading(false);
    };
    if (isLoading) initialize();
  });

  if (isLoading) return LoadingIndication;

  return (
    <>
      <NavigationContainer theme={CustomDarkTheme}>
        <React.Suspense fallback={LoadingIndication}>
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
