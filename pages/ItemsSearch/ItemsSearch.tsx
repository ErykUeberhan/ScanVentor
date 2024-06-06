import ItemModal from "@/components/ItemModal";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, FlatList, Text } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import { Item } from "../LocationDetails/LocationDetails";
import ListItem from "@/pages/LocationDetails/ListItem";
import { databaseServerIp } from "@/global-consts";
import ItemsSearchListItem from "./ItemsSearchListItem";

const ItemsSearch = ({
  setOpenItemsSearch,
}: {
  setOpenItemsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [foundItems, setFoundItems] = useState<Item[]>();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery)
      fetch(`http://${databaseServerIp}:3000/api/find-items/${searchQuery}`)
        .then((response) => response.json())
        .then((json) => {
          setFoundItems(json ?? undefined);
        })
        .catch((error) => console.error(error));
    else setFoundItems(undefined);
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
            setOpenItemsSearch(false);
          }}
        />
        <Text
          style={{
            color: "#00483d",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Search for item
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
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{
          height: 60,
          width: "100%",
          borderWidth: 2,
          borderRadius: 16,
          borderColor: "#d8d8d8",
          backgroundColor: "white",
        }}
        inputStyle={{
          color: "black",
        }}
      />

      {foundItems ? (
        foundItems.length > 0 ? (
          <>
            <Text>
              Total items found:{" "}
              {foundItems.reduce((total, item) => total + item.quantity, 0)}
            </Text>
            <FlatList
              data={foundItems}
              renderItem={(item) => <ItemsSearchListItem item={item.item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          </>
        ) : (
          <Text style={{ textAlign: "center" }}>
            No items found with the given name
          </Text>
        )
      ) : (
        <Text style={{ textAlign: "center" }}>
          Enter item name in the search bar above to find your desired items
          quickly
        </Text>
      )}
    </View>
  );
};

export default ItemsSearch;
