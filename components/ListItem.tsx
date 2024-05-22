import { Item } from "@/pages/LocationDetails";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";

const ListItem = ({
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
        padding: 12,
        borderWidth: 1,
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
        <Text style={{ fontFamily: "SpaceMono" }}>{item.name}</Text>
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

export default ListItem;
