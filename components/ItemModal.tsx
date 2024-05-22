import React, { useEffect, useState } from "react";
import { Keyboard, View, TextInput, Button, Text } from "react-native";
import { Portal, Dialog } from "react-native-paper";

const ItemModal = ({
  visible,
  hideDialog,
  moveItem,
}: {
  visible: boolean;
  hideDialog: () => void;
  moveItem: (quantity: number, location: number) => void;
}) => {
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

export default ItemModal;
