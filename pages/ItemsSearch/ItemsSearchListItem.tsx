import { databaseServerIp } from "@/global-consts";
import { Item } from "@/pages/LocationDetails";
import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";

const ItemsSearchListItem = ({ item }: { item: Item }) => {
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    fetch(
      `http://${databaseServerIp}:3000/api/get-location-name/${item.location_id}`
    )
      .then((response) => response.text())
      .then((json) => {
        setLocationName(json);
        console.log(json);
      })
      .catch((error) => console.error(error));
  }, [item.location_id]);

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
      </View>
      <View>
        <Text style={{ fontWeight: 700 }}>{locationName}</Text>
        <Text style={{ color: "#50a090" }}>Quantity: {item.quantity}</Text>
      </View>
    </View>
  );
};

export default ItemsSearchListItem;
