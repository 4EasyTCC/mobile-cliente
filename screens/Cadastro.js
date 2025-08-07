import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "@env";

const handleCadastro = async () => {
  if (!nome || !email || !senha) {
    Alert.alert("Erro", "Preencha todos os campos!");
    return;
  }

  try {
    const response = await axios.post(API_URL, {
      nome,
      email,
      senha,
    });

    if (response.status === 201) {
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("Login");
    }
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    if (error.response?.data?.message) {
      Alert.alert("Erro", error.response.data.message);
    } else {
      Alert.alert("Erro", "Erro ao realizar cadastro.");
    }
  }
};

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo4easy.jpeg")} style={styles.logo} />

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.inactiveTab}>LOGIN</Text>
        </TouchableOpacity>
        <Text style={styles.activeTab} onPress={() => handleCadastro}>
          CADASTRAR
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="person"
          size={20}
          color="#888"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="NOME"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="email"
          size={20}
          color="#888"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="SENHA"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      <TouchableOpacity>
        <LinearGradient colors={["#4f46e5", "#3b82f6"]} style={styles.button}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.footer}>
          Já possui uma conta? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  activeTab: {
    fontFamily: "MontserratBold",
    marginHorizontal: 20,
    fontSize: 16,
    color: "#4f46e5",
    borderBottomWidth: 2,
    borderBottomColor: "#4f46e5",
    paddingBottom: 5,
  },
  inactiveTab: {
    fontFamily: "Montserrat",
    marginHorizontal: 20,
    fontSize: 16,
    color: "#aaa",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontFamily: "Montserrat",
    color: "#333",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
  },
  buttonText: {
    fontFamily: "MontserratBold",
    color: "white",
    fontSize: 16,
  },
  footer: {
    fontFamily: "Montserrat",
    color: "#666",
    fontSize: 14,
  },
  link: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
});
