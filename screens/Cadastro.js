// Cadastro.js
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

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para formatar o CPF
  function formatarCPF(value) {
    let v = value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  }

  const handleCadastro = async () => {
    if (!nome || !cpf || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido!");
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert("Erro", "Email inválido!");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "Senha deve ter pelo menos 6 caracteres!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/cadastro/convidado`, {
        nome: nome.trim(),
        cpf: cpf.replace(/[^\d]/g, ""),
        email: email.toLowerCase().trim(),
        senha,
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      }
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage =
          error.response.data?.message || error.response.data?.error;
        switch (statusCode) {
          case 400:
            Alert.alert("Erro", errorMessage || "Dados inválidos!");
            break;
          case 409:
            Alert.alert("Erro", "Este email ou CPF já está cadastrado!");
            break;
          case 500:
            Alert.alert(
              "Erro",
              "Erro interno do servidor. Tente novamente mais tarde."
            );
            break;
          default:
            Alert.alert("Erro", errorMessage || "Erro ao realizar cadastro.");
        }
      } else if (error.request) {
        Alert.alert(
          "Erro de Conexão",
          "Não foi possível conectar ao servidor. Verifique sua internet."
        );
      } else {
        Alert.alert("Erro", "Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

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
        <MaterialIcons name="person" size={20} color="#4525a4" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="NOME"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="badge" size={20} color="#4525a4" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={cpf}
          onChangeText={(text) => setCpf(formatarCPF(text))}
          maxLength={14}
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#4525a4" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={20} color="#4525a4" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="SENHA"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          editable={!loading}
        />
      </View>

      <TouchableOpacity onPress={handleCadastro} disabled={loading}>
        <LinearGradient
          colors={loading ? ["#ccc", "#999"] : ["#4525a4", "#1868fd"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.button, styles.shadow, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? "CADASTRANDO..." : "CADASTRAR"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        disabled={loading}
      >
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
    width: 250,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  activeTab: {
    marginHorizontal: 20,
    fontSize: 16,
    color: "#4525a4",
    borderBottomWidth: 2,
    borderBottomColor: "#4525a4",
    paddingBottom: 5,
    fontWeight: "bold",
  },
  inactiveTab: {
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
    color: "#333",
  },
  button: {
    // Aumentado o padding horizontal para maior largura
    paddingHorizontal: 40, 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  footer: {
    color: "#666",
    fontSize: 14,
  },
  link: {
    color: "#007aff",
    fontWeight: "bold",
  },
});