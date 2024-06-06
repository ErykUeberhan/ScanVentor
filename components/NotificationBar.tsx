import React, { useState, useEffect } from "react";
import { Animated, StyleSheet, Text, Image } from "react-native";

const NotificationBar = ({
  notificationMessage,
}: {
  notificationMessage: string;
}) => {
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (notificationMessage) {
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 70,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }
  }, [notificationMessage, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.notificationBar,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Image
        source={require("../assets/icons/check.png")}
        style={{ width: 32, height: 32 }}
      />
      <Text>{notificationMessage}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationBar: {
    position: "absolute",
    flexDirection: "row",
    gap: 12,
    bottom: 0,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    alignSelf: "center",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default NotificationBar;
