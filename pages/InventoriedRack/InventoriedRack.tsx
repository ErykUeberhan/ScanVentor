import ItemModal from "@/components/ItemModal";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import InventoriedRackListItem from "./InventoriedRackListItem";
import { databaseServerIp } from "@/global-consts";
import InventoriedRackItemModal from "./InventoriedRackItemModal";
import { useAppContext } from "@/contexts/AppContext";
import { Item } from "../LocationDetails";
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
    setIsInventoryInProgress(false);
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
        setRackItems(json);
        console.log("json: ", json);
      })
      .catch((error) => console.error(error));
  }, [databaseServerIp, rackToInventory.id]);

  useEffect(() => {
    setIsThereUncountedItem(
      rackItems?.some((e) => e.counting_result === null) || false
    );
  }, [rackItems]);

  return (
    <View style={{ gap: 12 }}>
      <View>
        <Text>The inventory process is ongoing,</Text>
        <Text>the assigned shelf for you is:</Text>
        <Text>Rack name: {rackToInventory.name}</Text>
        <Text>Rack ID: {rackToInventory.id}</Text>
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
      <InventoriedRackItemModal
        visible={!!currentItemId}
        hideDialog={hideDialog}
        changeItemCountingResult={changeItemCountingResult}
      />
    </View>
  );
};

export default InventoriedRack;
