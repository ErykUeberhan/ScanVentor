import { databaseServerIp } from "@/global-consts";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { IconButton } from "react-native-paper";
import { Item } from "./LocationDetails/LocationDetails";
import { useAppContext } from "@/contexts/AppContext";

type Location = {
  id: number;
  name: string;
  inventoryable: number;
  inventoried: number;
};

const InventoryResults = ({
  setOpenInventoryResults,
}: {
  setOpenInventoryResults: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [items, setItems] = useState<(Item & { location_name?: string })[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { setIsInventoryInProgress, setNotificationMessage } = useAppContext();

  const approveInventory = () => {
    fetch(`http://${databaseServerIp}:3000/api/approve-inventory`).catch(
      (error) => console.error(error)
    );
    setOpenInventoryResults(false);
    setIsInventoryInProgress("no");
    setNotificationMessage("Inventory approved");
  };

  useEffect(() => {
    fetch(`http://${databaseServerIp}:3000/api/get-items`)
      .then((response) => response.json())
      .then((json) => setItems(json))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetch(`http://${databaseServerIp}:3000/api/get-locations`)
      .then((response) => response.json())
      .then((json) => setLocations(json))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    locations &&
      items &&
      setItems((prevItems) =>
        prevItems.map((item) => {
          const location = locations.find(
            (location) => location.id === item.location_id
          );
          return {
            ...item,
            location_name: location?.name,
          };
        })
      );
  }, [locations]);

  return (
    <View style={{ gap: 12, flex: 1 }}>
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
            setOpenInventoryResults(false);
          }}
        />
        <Text
          style={{
            color: "#00483d",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Inventory Results
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
      <TouchableOpacity
        onPress={() => {
          approveInventory();
        }}
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
        <Text style={{ color: "white", fontWeight: 700 }}>
          Approve inventory
        </Text>
      </TouchableOpacity>
      <ScrollView>
        <View style={{ gap: 12, paddingBottom: 20 }}>
          {locations &&
            locations.map(
              (location) =>
                location.inventoryable === 1 && (
                  <View
                    key={location.id}
                    style={{
                      padding: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#eff0fb",
                      borderRadius: 12,
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        paddingHorizontal: 12,
                      }}
                    >
                      <Text style={{ fontSize: 20, fontWeight: 700 }}>
                        {location.name}
                      </Text>
                      <Text style={{ fontSize: 20, fontWeight: 700 }}>
                        {location.id}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: "#c8dad4",
                        height: 2,
                        width: "100%",
                      }}
                    />
                    {items &&
                      items.map(
                        (item) =>
                          item.location_id === location.id && (
                            <>
                              <View
                                key={item.id}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  width: "100%",
                                  gap: 12,
                                  paddingHorizontal: 12,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 12,
                                  }}
                                >
                                  <Image
                                    source={
                                      item.stock_id === 2
                                        ? require("../assets/icons/bolt.png")
                                        : require("../assets/icons/laptop.png")
                                    }
                                    style={{ width: 36, height: 36 }}
                                  />

                                  <Text style={{ fontWeight: 700 }}>
                                    {item.name}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    flex: 1,
                                    gap: 12,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "#790014",
                                      fontSize: 24,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {item.quantity}
                                  </Text>
                                  <FontAwesome6
                                    name="arrow-right"
                                    size={16}
                                    color="black"
                                  />
                                  <Text
                                    style={{
                                      color: "#00ad91",
                                      fontSize: 24,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {item.counting_result}
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={{
                                  backgroundColor: "#c8dad4",
                                  height: 2,
                                  width: "100%",
                                }}
                              />
                            </>
                          )
                      )}
                  </View>
                )
            )}
        </View>
      </ScrollView>
    </View>
  );
};

export default InventoryResults;
