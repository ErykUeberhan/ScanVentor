import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { Item } from "./LocationDetails";

const LocationDetailsListItem = ({
  item,
  showDialog,
}: {
  item: Item;
  showDialog: (itemId: string) => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 16,
      }}
    >
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 12,
          backgroundColor: "#eff0fb",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={
            item.stock_id === 2
              ? require("../../assets/icons/bolt.png")
              : require("../../assets/icons/laptop.png")
          }
          style={{ width: 36, height: 36 }}
        />
      </View>
      <View>
        <Text style={{ fontWeight: 700 }}>{item.name}</Text>
        <Text style={{ color: "#50a090" }}>Quantity: {item.quantity}</Text>
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

export default LocationDetailsListItem;
