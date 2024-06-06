import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { Item } from "../LocationDetails/LocationDetails";

type ColorObject = {
  green: string;
  yellow: string;
  red: string;
};

const BorderColors = {
  green: "#00ad91",
  yellow: "#fccb23",
  red: "#cf163a",
};

const BackgroundColors = {
  green: "#00ad91",
  yellow: "#fccb23",
  red: "#cf163a",
};

const InventoriedRackListItem = ({
  item,
  showDialog,
}: {
  item: Item;
  showDialog: (itemId: string) => void;
}) => {
  const getListItemColor = (colorObject: ColorObject) => {
    if (item.counting_result === null) return colorObject.yellow;

    if (item.counting_result === item.quantity) return colorObject.green;

    if (item.counting_result !== item.quantity) return colorObject.red;
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: 12,
        borderWidth: 2,
        borderColor: getListItemColor(BorderColors),
        backgroundColor: getListItemColor(BackgroundColors),
        marginBottom: 8,
        borderRadius: 8,
      }}
    >
      <Image
        source={
          item.stock_id === 2
            ? require("../../assets/icons/bolt.png")
            : require("../../assets/icons/laptop.png")
        }
        style={{ width: 42, height: 42 }}
      />
      <View>
        <Text style={{ fontFamily: "SpaceMono", fontWeight: 700 }}>
          {item.name}
        </Text>
        <Text>Quantity in database: {item.quantity}</Text>
        <Text>
          Your value:{" "}
          {item.counting_result !== null ? item.counting_result : "Not counted"}
        </Text>
      </View>
      <IconButton
        icon={() => (
          <MaterialIcons name="compare-arrows" size={24} color="black" />
        )}
        size={20}
        onPress={() => showDialog(String(item.id))}
      />
    </View>
  );
};

export default InventoriedRackListItem;
