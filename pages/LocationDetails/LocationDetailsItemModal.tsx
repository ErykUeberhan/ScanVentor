import React, { useState } from "react";
import {
  Keyboard,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";

const LocationDetailsItemModal = ({
  hideDialog,
  moveItem,
}: {
  hideDialog: () => void;
  moveItem: (quantity: number, location: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState(1);

  return (
    <Modal
      visible={true}
      transparent={true}
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          opacity: 0.3,
          position: "absolute",
        }}
      />
      <View
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                backgroundColor: "white",
                width: "80%",
                padding: 24,
                borderRadius: 12,
                gap: 8,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: "#00483d",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                Enter new value
              </Text>
              <Text
                style={{ color: "black", marginBottom: -4, fontWeight: 700 }}
              >
                Number of items:
              </Text>
              <TextInput
                keyboardType="numeric"
                value={String(quantity)}
                onChangeText={(text) => setQuantity(Number(text))}
                onBlur={() => {
                  setQuantity(Number(quantity));
                }}
                style={styles.input}
              />
              <Text
                style={{ color: "black", marginBottom: -4, fontWeight: 700 }}
              >
                New location ID:
              </Text>
              <TextInput
                keyboardType="numeric"
                value={String(location)}
                onChangeText={(text) => setLocation(Number(text))}
                onBlur={() => {
                  setLocation(Number(quantity));
                }}
                style={styles.input}
              />
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    moveItem(quantity, location);
                    hideDialog();
                  }}
                  style={styles.button}
                >
                  <Text style={{ color: "white", fontWeight: 700 }}>Agree</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => hideDialog()}
                  style={{
                    ...styles.button,
                    backgroundColor: "white",
                    borderColor: "#00483d",
                    borderWidth: 2,
                  }}
                >
                  <Text style={{ color: "#00483d", fontWeight: 700 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    minWidth: "100%",
    height: 60,
    padding: 12,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: "#d8d8d8",
    backgroundColor: "white",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    backgroundColor: "#00483d",
    borderRadius: 16,
    padding: 12,
  },
});

export default LocationDetailsItemModal;
