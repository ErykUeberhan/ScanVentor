import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { View } from "react-native";
import QRScanner from "@/components/Camera";
import LocationDetails from "@/components/LocationDetails";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SourceSans3: require("../assets/fonts/SourceSans/static/SourceSans3-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider>
      <RootLayoutNav />
    </PaperProvider>
  );
}

function RootLayoutNav() {
  const [dataFromQR, setDataFromQR] = useState<number | null>(null);
  console.log("dataFromQR: ", dataFromQR);
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View style={{ backgroundColor: "black", height: 30, width: "100%" }} />
      {dataFromQR ? (
        <LocationDetails
          dataFromQR={dataFromQR}
          setDataFromQR={setDataFromQR}
        />
      ) : (
        <QRScanner setDataFromQR={setDataFromQR} />
      )}
    </View>
  );
}
