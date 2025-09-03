import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";

const socket = io("http://10.80.220.253:6969");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", { text: message, sender: "Usuário" });
      setMessage("");
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === "Usuário";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.ownerMessage,
        ]}
      >
        <Ionicons name="person-circle" size={30} color="#fff" style={styles.avatar} />
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.ownerBubble]}>
          <Text style={styles.sender}>{item.sender}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#4525a4", "#1868fd"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientBox}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image source={require("../assets/Logo oficial.png")} style={styles.logo} />
        <Ionicons name="person-circle-outline" size={36} color="#4525a4" />
      </View>

      {/* KeyboardAvoidingView para subir input com teclado */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={70}
      >
        {/* Lista de mensagens */}
        <FlatList
          ref={flatListRef}
          data={chat}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 10 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Campo de input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity onPress={sendMessage}>
            <LinearGradient
              colors={["#4525a4", "#1868fd"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.sendButton}
            >
              <Ionicons name="send" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBox: { flex: 1 },
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: { width: 70, height: 40, resizeMode: "contain" },

  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  avatar: { marginRight: 5 },

  bubble: {
    maxWidth: "75%",
    borderRadius: 15,
    padding: 10,
  },
  userBubble: {
    backgroundColor: "#4525a4",
    alignSelf: "flex-start",
  },
  ownerBubble: {
    backgroundColor: "#1868fd",
    alignSelf: "flex-end",
  },
  sender: { fontSize: 12, fontWeight: "bold", color: "#fff" },
  messageText: { fontSize: 16, color: "#fff" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
