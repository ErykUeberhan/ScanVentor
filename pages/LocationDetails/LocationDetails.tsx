import { databaseServerIp } from "@/global-consts";
import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import LocationDetailsListItem from "./LocationDetailsListItem";
import LocationDetailsItemModal from "./LocationDetailsItemModal";

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
  setOpenScanner,
}: {
  dataFromQR: number;
  setDataFromQR: React.Dispatch<React.SetStateAction<number | null>>;
  setOpenScanner: React.Dispatch<React.SetStateAction<boolean>>;
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
      .then((json) =>
        setRackItems(
          searchQuery
            ? json.filter((item: Item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : json
        )
      )
      .catch((error) => console.error(error));
  }, [searchQuery]);

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        <IconButton
          icon={() => (
            <FontAwesome6 name="arrow-left" size={16} color="black" />
          )}
          style={{
            margin: 0,
          }}
          onPress={() => {
            setDataFromQR(null);
            setOpenScanner(false);
          }}
        />
        <Text
          style={{
            color: "#00483d",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Move Items
        </Text>
        <IconButton
          icon={() => (
            <FontAwesome6 name="arrow-left" size={16} color="black" />
          )}
          style={{
            opacity: 0,
            margin: 0,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          gap: 8,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{
            flex: 1,
            height: 60,
            borderWidth: 2,
            borderRadius: 16,
            borderColor: "#d8d8d8",
            backgroundColor: "white",
          }}
          inputStyle={{
            color: "black",
          }}
        />
        <TouchableOpacity
          onPress={() => setDataFromQR(null)}
          style={{
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
            backgroundColor: "#00483d",
            height: 60,
            borderRadius: 16,
            padding: 12,
          }}
        >
          <Text style={{ color: "white", fontWeight: 700 }}>Scan Again</Text>
        </TouchableOpacity>
      </View>

      {rackItems ? (
        <FlatList
          data={rackItems}
          renderItem={(item) => (
            <LocationDetailsListItem item={item.item} showDialog={showDialog} />
          )}
          keyExtractor={(item) => item.name}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      {!!currentItemId && (
        <LocationDetailsItemModal hideDialog={hideDialog} moveItem={moveItem} />
      )}
    </View>
  );
}
