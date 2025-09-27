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
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validação dos campos
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    // Validação básica do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Digite um email válido!");
      return;
    }

    setLoading(true);

    try {
      // Fazendo a requisição para o backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.toLowerCase().trim(),
        senha,
      });

      if (response.status === 200) {
        const { token, organizador, user } = response.data;
        
        // Salvando os dados do usuário no AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(organizador || user));
        
        console.log("Usuário logado:", organizador || user);
        
        Alert.alert(
          "Sucesso", 
          "Login realizado com sucesso!",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("PagInicial")
            }
          ]
        );
      }
    } catch (error) {
      console.error("Erro no login:", error);
      
      if (error.response) {
        // Erro do servidor com resposta
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error;
        
        switch (statusCode) {
          case 400:
            Alert.alert("Erro", errorMessage || "Dados inválidos!");
            break;
          case 401:
            Alert.alert("Erro", "Email ou senha incorretos!");
            break;
          case 404:
            Alert.alert("Erro", "Usuário não encontrado!");
            break;
          case 500:
            Alert.alert("Erro", "Erro interno do servidor. Tente novamente mais tarde.");
            break;
          default:
            Alert.alert("Erro", errorMessage || "Erro ao fazer login.");
        }
      } else if (error.request) {
        // Erro de conexão
        Alert.alert(
          "Erro de Conexão", 
          "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
        );
      } else {
        // Outro tipo de erro
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
        <Text style={styles.activeTab}>
          LOGIN
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.inactiveTab}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="email"
          size={20}
          color="#4525a4"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons 
          name="lock" 
          size={20} 
          color="#4525a4" 
          style={styles.icon} 
        />
        <TextInput
          style={styles.input}
          placeholder="SENHA"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
      </View>

      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <LinearGradient 
          colors={loading ? ['#ccc', '#999'] : ['#4525a4', '#1868fd']} 
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? "ENTRANDO..." : "LOGIN"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("EsquecerSenha")}
        disabled={loading}
      >
        <Text style={styles.footer}>
          <Text style={styles.link}>Esqueci a senha</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("Cadastro")}
        disabled={loading}
      >
        <Text style={styles.footer}>
          Não possui uma conta? <Text style={styles.link}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
    fontFamily: "MontserratBold",
    marginHorizontal: 20,
    fontSize: 16,
    color: "#4525a4",
    borderBottomWidth: 2,
    borderBottomColor: "#4525a4",
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
    paddingVertical: 15,
    paddingHorizontal: 120,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
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
    color: "#007aff",
    fontWeight: "bold",
  },
});