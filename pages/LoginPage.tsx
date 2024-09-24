import { useAppContext } from "@/contexts/AppContext";
import { databaseServerIp } from "@/global-consts";
import React from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

const LoginPage = () => {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setCurrentUser } = useAppContext();

  const logIn = () => {
    fetch(`http://${databaseServerIp}:3000/api/log-in/${login}/${password}`)
      .then((response) => response.json())
      .then((json) => {
        setCurrentUser(json);
      })
      .catch((error) => console.error(error));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            height: "100%",
          }}
        >
          <Text style={{ color: "#00483d", fontSize: 32 }}>ScanVentor</Text>
          <Image
            source={require("../assets/icons/image.png")}
            style={{ width: 100, height: 100 }}
          />

          <View
            style={{
              gap: 12,
              width: "100%",
            }}
          >
            <View style={{ gap: 12 }}>
              <View
                style={{
                  gap: 4,
                }}
              >
                <Text style={{ fontWeight: 700 }}>Username</Text>
                <TextInput
                  value={login}
                  onChangeText={(text) => setLogin(text)}
                  style={styles.input}
                />
              </View>
              <View
                style={{
                  gap: 4,
                }}
              >
                <Text style={{ fontWeight: 700 }}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <View
              style={{
                gap: 8,
              }}
            >
              <TouchableOpacity onPress={() => logIn()} style={styles.button}>
                <Text style={{ color: "white", fontWeight: 700 }}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => logIn()} style={styles.button}>
                <Text style={{ color: "white", fontWeight: 700 }}>
                  Create account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
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
  },
});

export default LoginPage;
