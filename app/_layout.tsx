import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { View, Text } from "react-native";
import QRScanner from "@/pages/Camera";
import LocationDetails from "@/pages/LocationDetails";
import LoginPage from "@/pages/LoginPage";
import UserPanel from "@/pages/UserPanel";
import InventoriedRack from "@/pages/InventoriedRack/InventoriedRack";
import { AppContextProvider, useAppContext } from "@/contexts/AppContext";

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
      <AppContextProvider>
        <RootLayoutNav />
      </AppContextProvider>
    </PaperProvider>
  );
}

function RootLayoutNav() {
  const [dataFromQR, setDataFromQR] = useState<number | null>(null);
  const [openScanner, setOpenScanner] = useState(false);
  const { isInventoryInProgress, currentUser } = useAppContext();

  const navigation = () => {
    if (!currentUser) return <LoginPage />;

    if (dataFromQR)
      return (
        <LocationDetails
          dataFromQR={dataFromQR}
          setDataFromQR={setDataFromQR}
        />
      );

    if (openScanner)
      return (
        <QRScanner
          setDataFromQR={setDataFromQR}
          setOpenScanner={setOpenScanner}
        />
      );
    console.log(isInventoryInProgress);
    console.log(currentUser?.role === "worker");
    if (isInventoryInProgress && currentUser?.role === "worker")
      return <InventoriedRack />;

    if (currentUser) return <UserPanel setOpenScanner={setOpenScanner} />;
  };

  return (
    <>
      <View style={{ backgroundColor: "black", height: 22, zIndex: 1000 }} />
      <View style={{ width: "100%", height: "100%", padding: 12 }}>
        {navigation()}
      </View>
    </>
  );
}
