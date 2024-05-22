import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import { Item } from "../LocationDetails";

type ColorObject = {
  green: string;
  yellow: string;
  red: string;
};

const BorderColors = {
  green: "#36846b",
  yellow: "#d68438",
  red: "#b84d69",
};

const BackgroundColors = {
  green: "#4bb39a",
  yellow: "#f1b24b",
  red: "#f96d6d",
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
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#eff0fb",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fontisto name="laptop" size={24} color="black" />
      </View>
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
