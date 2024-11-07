import "./gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { SQLiteProvider } from "expo-sqlite/next";
import Toast from "react-native-toast-message";
import ScreenList from "./components/ScreenList";
import { initializeProfile } from "./components/DatabaseController";

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const db = "test.db";
  const LoadingIndication = (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  );

  React.useEffect(() => {
    initializeProfile().then(() => setIsLoading(false));
  });

  if (isLoading) return LoadingIndication;

  return (
    <>
      <NavigationContainer>
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
