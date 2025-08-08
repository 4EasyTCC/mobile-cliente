import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "@env";
import axios from "axios";

function validarEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = async () => {
    console.log("Botão de cadastro pressionado");

    if (!nome || !cpf || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert("Erro", "Email inválido!");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "Senha deve ter ao menos 6 caracteres");
      return;
    }
    try {
      console.log("API_URL:", API_URL);
      const response = await axios.post(`${API_URL}/cadastro/convidado`, {
        nome,
        cpf,
        email,
        senha,
      });

      console.log("Resposta do backend:", response.data);

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
  function formatarCPF(value) {
    let v = value.replace(/\D/g, "");

    v = v.slice(0, 11);

    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return v;
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo4easy.jpeg")} style={styles.logo} />

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.inactiveTab}>LOGIN</Text>
        </TouchableOpacity>
        <Text style={styles.activeTab}>CADASTRAR</Text>
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
          name="badge"
          size={20}
          color="#888"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={cpf}
          onChangeText={(text) => setCpf(formatarCPF(text))}
          maxLength={14}
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
          keyboardType="email-address"
          autoCapitalize="none"
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

      <TouchableOpacity onPress={handleCadastro}>
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
