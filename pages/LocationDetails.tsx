import ItemModal from "@/components/ItemModal";
import ListItem from "@/components/ListItem";
import { databaseServerIp } from "@/global-consts";
import React, { useEffect, useState } from "react";
import { View, FlatList, Button, Text } from "react-native";
import { Searchbar } from "react-native-paper";

export type Item = {
  id: number;
  name: string;
  quantity: number;
  location_id: number;
  stock_id: number;
  counting_result: number | null;
};

export default function LocationDetails({
  dataFromQR,
  setDataFromQR,
}: {
  dataFromQR: number;
  setDataFromQR: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const [rackItems, setRackItems] = useState<Item[]>();
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showDialog = (itemId: string) => {
    setCurrentItemId(itemId);
  };

  const hideDialog = () => setCurrentItemId(null);

  const moveItem = (quantity: number, location: number) => {
    fetch(
      `http://${databaseServerIp}:3000/api/move-items-from-rack/${dataFromQR}/${currentItemId}/${quantity}/${location}`
    )
      .then((response) => response.json())
      .then((json) => {
        setRackItems(json);
        console.log("json", json);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetch(
      `http://${databaseServerIp}:3000/api/get-items-from-rack/` + dataFromQR
    )
      .then((response) => response.json())
      .then((json) => setRackItems(json))
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 12,
        }}
      >
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ flex: 1 }}
        />
        <Button title="Scan Again" onPress={() => setDataFromQR(null)} />
      </View>

      {rackItems ? (
        <FlatList
          data={rackItems}
          renderItem={(item) => (
            <ListItem item={item.item} showDialog={showDialog} />
          )}
          keyExtractor={(item) => item.name}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      <ItemModal
        visible={!!currentItemId}
        hideDialog={hideDialog}
        moveItem={moveItem}
      />
    </View>
  );
}
