import React, { useEffect, useState } from "react";
import { Keyboard, View, TextInput, Button, Text } from "react-native";
import { Portal, Dialog } from "react-native-paper";

const InventoriedRackItemModal = ({
  visible,
  hideDialog,
  changeItemCountingResult,
}: {
  visible: boolean;
  hideDialog: () => void;
  changeItemCountingResult: (countingResult: number) => void;
}) => {
  const [countingResult, setCountingResult] = useState(1);
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
          <Text>Counting results:</Text>
          <TextInput
            keyboardType="numeric"
            value={String(countingResult)}
            onChangeText={(text) => {
              setCountingResult(Number(text));
            }}
            onBlur={() => {
              setCountingResult(Number(countingResult));
            }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            title="Agree"
            onPress={() => {
              changeItemCountingResult(countingResult);
              hideDialog();
            }}
          />
          <Button title="Cancel" onPress={() => hideDialog()} />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default InventoriedRackItemModal;
