import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function QRScanner({
  setDataFromQR,
  setOpenScanner,
}: {
  setDataFromQR: React.Dispatch<React.SetStateAction<number | null>>;
  setOpenScanner: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: any }) => {
    setScanned(true);
    setDataFromQR(Number(data));
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (hasPermission === true) {
    console.log("hasPermission: ", hasPermission);
  }

  return (
    <View style={{ flex: 1, justifyContent: "space-evenly" }}>
      <View
        style={{
          height: 250,
          width: 250,
          alignSelf: "center",
          borderRadius: 50,
          overflow: "hidden",
        }}
      >
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => setOpenScanner(false)}
        style={styles.button}
      >
        <Text style={{ color: "white", fontWeight: 700 }}>
          Go back to user panel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    backgroundColor: "#00483d",
    borderRadius: 16,
  },
});
