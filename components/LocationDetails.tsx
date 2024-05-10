import { Fontisto } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Button,
  TextInput,
  Keyboard,
  Text,
} from "react-native";
import { Dialog, IconButton, Portal, Searchbar } from "react-native-paper";

export default function LocationDetails({
  dataFromQR,
  setDataFromQR,
}: {
  dataFromQR: number;
  setDataFromQR: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const [data, setData] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  const showDialog = (itemId: string) => {
    setVisible(true);
    setCurrentItemId(itemId);
  };
  const hideDialog = () => setVisible(false);

  const moveItem = (quantity: number, location: number) => {
    fetch(
      `http://192.168.1.14:3000/api/move-items-from-rack/${dataFromQR}/${currentItemId}/${quantity}/${location}`
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        console.log("json", json);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetch("http://192.168.1.14:3000/api/get-items-from-rack/" + dataFromQR)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  const ItemModal = () => {
    const [quantity, setQuantity] = useState(1);
    const [location, setLocation] = useState(1);
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        (event) => {
          setKeyboardOffset(event.endCoordinates.height);
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardOffset(0);
        }
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

    return (
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{
            backgroundColor: "white",
            marginBottom: keyboardOffset + 20,
          }}
        >
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <View>
              <Text>Quantity:</Text>
              <TextInput
                keyboardType="numeric"
                value={String(quantity)}
                onChangeText={(text) => {
                  setQuantity(Number(text));
                }}
                onBlur={() => {
                  setQuantity(Number(quantity));
                }}
              />
              <Text style={{ color: "black" }}>Location:</Text>
              <TextInput
                keyboardType="numeric"
                value={String(location)}
                onChangeText={(text) => setLocation(Number(text))}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              title="Agree"
              onPress={() => {
                moveItem(quantity, location);
                hideDialog();
              }}
            />
            <Button title="Cancel" onPress={() => hideDialog()} />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const ListItem = ({ item }: { item: any }) => (
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
        onPress={() => showDialog(item.id)}
      />
    </View>
  );

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

      {data ? (
        <FlatList
          data={data}
          renderItem={ListItem}
          keyExtractor={(item) => item.name}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      <ItemModal />
    </View>
  );
}
