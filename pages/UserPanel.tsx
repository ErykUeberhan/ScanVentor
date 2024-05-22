import { CurrentUser, useAppContext } from "@/contexts/AppContext";
import { databaseServerIp } from "@/global-consts";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const UserPanel = ({
  setOpenScanner,
}: {
  setOpenScanner: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    isInventoryInProgress,
    currentUser,
    setIsInventoryInProgress,
    setCurrentUser,
  } = useAppContext();

  const currentUserCapitalized =
    currentUser && currentUser.login
      ? currentUser.login.charAt(0).toUpperCase() + currentUser.login.slice(1)
      : "";

  const startInventoryProcess = () => {
    fetch(`http://${databaseServerIp}:3000/api/start-inventory-process`);
    setIsInventoryInProgress(true);
  };

  const cancelInventoryProcess = () => {
    fetch(`http://${databaseServerIp}:3000/api/cancel-inventory-process`);
    setIsInventoryInProgress(false);
  };

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text
        style={{
          color: "#00483d",
          fontSize: 24,
          flexWrap: "wrap",
          fontWeight: 700,
        }}
      >
        {currentUserCapitalized} Panel
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <UserPanelButton
          text={"Move items"}
          action={() => setOpenScanner(true)}
        />
        <UserPanelButton text="Search for item" action={() => ""} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <UserPanelButton
          text={isInventoryInProgress ? "Cancel inventory" : "Start inventory"}
          action={() =>
            isInventoryInProgress
              ? cancelInventoryProcess()
              : startInventoryProcess()
          }
        />
        <UserPanelButton text="Log out" action={() => setCurrentUser(null)} />
      </View>
    </View>
  );
};

const UserPanelButton = ({
  text,
  action,
}: {
  text: string;
  action: () => void;
}) => {
  return (
    <LinearGradient
      colors={["rgba(1,71,60,1)", "rgba(0,121,98,1)"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <TouchableOpacity onPress={action} style={styles.touchable}>
        <View
          style={{
            backgroundColor: "#66988f",
            borderRadius: 100,
            height: 50,
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/icons/image.png")}
            style={{ width: 32, height: 32 }}
          />
        </View>

        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 60,
    borderRadius: 16,
  },
  gradient: {
    borderRadius: 16,
    overflow: "hidden",
  },
  touchable: {
    height: 130,
    width: 130,
    padding: 12,
    gap: 8,
  },
  text: {
    color: "white",
    fontWeight: "500",
  },
});

export default UserPanel;
