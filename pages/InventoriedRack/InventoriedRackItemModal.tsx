import React, { useEffect, useState } from "react";
import {
  Keyboard,
  View,
  TextInput,
  Text,
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const InventoriedRackItemModal = ({
  hideDialog,
  changeItemCountingResult,
}: {
  hideDialog: () => void;
  changeItemCountingResult: (countingResult: number) => void;
}) => {
  const [countingResult, setCountingResult] = useState(1);
  const [keyboardOffset] = useState(new Animated.Value(0));

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        Animated.timing(keyboardOffset, {
          duration: event.duration,
          toValue: -event.endCoordinates.height,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(keyboardOffset, {
          duration: 250,
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
                gap: 12,
              }}
            >
              <Text
                style={{
                  color: "#00483d",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                Enter new value
              </Text>
              <TextInput
                keyboardType="numeric"
                value={String(countingResult)}
                onChangeText={(text) => setCountingResult(Number(text))}
                onBlur={() => {
                  setCountingResult(Number(countingResult));
                }}
                style={{
                  ...styles.input,
                }}
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
                    changeItemCountingResult(countingResult);
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
export default InventoriedRackItemModal;
