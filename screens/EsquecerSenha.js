import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "@env";
import axios from "axios";

function validarEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export default function EsquecerSenha({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEsquecerSenha = async () => {
    // Validação do campo email
    if (!email) {
      Alert.alert("Erro", "Digite seu email!");
      return;
    }

    // Validação do formato do email
    if (!validarEmail(email)) {
      Alert.alert("Erro", "Digite um email válido!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/esqueci-senha`, {
        email: email.toLowerCase().trim(),
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Sucesso", 
          "Email de recuperação enviado! Verifique sua caixa de entrada e spam.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login")
            }
          ]
        );
      }
    } catch (error) {
      console.error("Erro ao solicitar recuperação:", error);

      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error;
        
        switch (statusCode) {
          case 400:
            Alert.alert("Erro", errorMessage || "Email inválido!");
            break;
          case 404:
            Alert.alert("Erro", "Email não encontrado em nosso sistema!");
            break;
          case 429:
            Alert.alert("Erro", "Muitas tentativas. Tente novamente em alguns minutos.");
            break;
          case 500:
            Alert.alert("Erro", "Erro interno do servidor. Tente novamente mais tarde.");
            break;
          default:
            Alert.alert("Erro", errorMessage || "Erro ao enviar email de recuperação.");
        }
      } else if (error.request) {
        Alert.alert(
          "Erro de Conexão", 
          "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
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
      <Image source={require('../assets/Logo4easy.jpeg')} style={styles.logo} />
      
      <View style={styles.tabContainer}>
        <Text style={styles.activeTab}>
          RECUPERAR SENHA
        </Text>
      </View>

      <Text style={styles.instructionText}>
        Digite seu email para receber as instruções de recuperação de senha
      </Text>

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

      <TouchableOpacity onPress={handleEsquecerSenha} disabled={loading}>
        <LinearGradient 
          colors={loading ? ['#ccc', '#999'] : ['#4525a4', '#1868fd']} 
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? "ENVIANDO..." : "ENVIAR EMAIL"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("Login")}
        disabled={loading}
        style={styles.backButton}
      >
        <Text style={styles.backText}>
          <MaterialIcons name="arrow-back" size={16} color="#4525a4" />
          {" "}Voltar ao Login
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
    marginBottom: 20,
  },
  activeTab: {
    fontFamily: "MontserratBold",
    fontSize: 16,
    color: "#4525a4",
    borderBottomWidth: 2,
    borderBottomColor: "#4525a4",
    paddingBottom: 5,
    textAlign: "center",
  },
  instructionText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
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
    paddingHorizontal: 100,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
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
  backButton: {
    marginBottom: 15,
  },
  backText: {
    fontFamily: "MontserratBold",
    color: "#4525a4",
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    fontFamily: "Montserrat",
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  link: {
    color: "#007aff",
    fontWeight: "bold",
  },
});