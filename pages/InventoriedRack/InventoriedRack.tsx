import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import InventoriedRackListItem from "./InventoriedRackListItem";
import { databaseServerIp } from "@/global-consts";
import InventoriedRackItemModal from "./InventoriedRackItemModal";
import { useAppContext } from "@/contexts/AppContext";
import { Item } from "../LocationDetails/LocationDetails";
import { Entypo } from "@expo/vector-icons";

type RackToInventory = {
  id: number;
  name: string;
  inventoryable: boolean;
};

const InventoriedRack = () => {
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rackToInventory, setRackToInventory] = useState<RackToInventory>(
    {} as RackToInventory
  );
  const [rackItems, setRackItems] = useState<Item[]>();
  const [isThereUncountedItem, setIsThereUncountedItem] =
    useState<boolean>(true);
  const { currentUser, setIsInventoryInProgress } = useAppContext();

  const showDialog = (itemId: string) => {
    setCurrentItemId(itemId);
  };

  const hideDialog = () => setCurrentItemId(null);

  const confirmRackInventory = () => {
    fetch(
      `http://${databaseServerIp}:3000/api/confirm-rack-inventory/${rackToInventory?.id}`
    );
    setIsInventoryInProgress("no");
  };

  const changeItemCountingResult = (countingResult: number) => {
    fetch(
      `http://${databaseServerIp}:3000/api/change-item-counting-result/${currentItemId}/${countingResult}`
    ).catch((error) => console.error(error));

    if (!rackToInventory.id) return;
    fetch(
      `http://${databaseServerIp}:3000/api/get-items-from-rack/` +
        rackToInventory.id
    )
      .then((response) => response.json())
      .then((json) => {
        setRackItems(json);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetch(
      `http://${databaseServerIp}:3000/api/get-rack-to-inventory/${currentUser?.id}`
    )
      .then((response) => response.json())
      .then((json) => {
        setRackToInventory(json);
      })
      .catch((error) => console.error(error));
  }, [databaseServerIp, currentUser?.id]);

  useEffect(() => {
    if (!rackToInventory.id) return;
    fetch(
      `http://${databaseServerIp}:3000/api/get-items-from-rack/` +
        rackToInventory.id
    )
      .then((response) => response.json())
      .then((json) => {
        setRackItems(
          searchQuery
            ? json.filter((item: Item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : json
        );
      })
      .catch((error) => console.error(error));
  }, [databaseServerIp, rackToInventory.id, searchQuery]);

  useEffect(() => {
    setIsThereUncountedItem(
      rackItems?.some((e) => e.counting_result === null) || false
    );
  }, [rackItems]);

  return (
    <View style={{ gap: 12 }}>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Text
          style={{
            color: "#00483d",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Inventory process is ongoing
        </Text>
        <Text
          style={{
            color: "#00483d",
          }}
        >
          Please check{" "}
          <Text style={{ fontWeight: 700 }}>{rackToInventory.name}</Text> with
          rack ID <Text style={{ fontWeight: 700 }}>{rackToInventory.id}</Text>
        </Text>
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
        <IconButton
          icon={() => <Entypo name="check" size={24} color="white" />}
          size={20}
          disabled={isThereUncountedItem}
          style={{
            margin: 0,
            backgroundColor: "#00483d",
            height: 60,
            width: 60,
            borderRadius: 16,
            opacity: isThereUncountedItem ? 0.3 : 1,
          }}
          onPress={() => confirmRackInventory()}
        />
      </View>

      {rackItems ? (
        <FlatList
          data={rackItems}
          renderItem={(item) => (
            <InventoriedRackListItem item={item.item} showDialog={showDialog} />
          )}
          keyExtractor={(item) => item.name}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      {!!currentItemId && (
        <InventoriedRackItemModal
          hideDialog={hideDialog}
          changeItemCountingResult={changeItemCountingResult}
        />
      )}
    </View>
  );
};

export default InventoriedRack;
