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
  cpf = cpf.replace(/[^\d]+/g,'');
  
  if(cpf.length !== 11 || 
     cpf === "00000000000" ||
     cpf === "11111111111" ||
     cpf === "22222222222" ||
     cpf === "33333333333" ||
     cpf === "44444444444" ||
     cpf === "55555555555" ||
     cpf === "66666666666" ||
     cpf === "77777777777" ||
     cpf === "88888888888" ||
     cpf === "99999999999") {
    return false;
  }
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto < 2 ? 0 : resto;
  
  if (digito1 !== parseInt(cpf.charAt(9))) {
    return false;
  }
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto < 2 ? 0 : resto;
  
  return digito2 === parseInt(cpf.charAt(10));
}

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  function formatarCPF(value) {
    let v = value.replace(/\D/g, "");
    v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  }

  const handleCadastro = async () => {
    console.log("Botão de cadastro pressionado");

    // Validação dos campos obrigatórios
    if (!nome || !cpf || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    // Validação do nome
    if (nome.trim().length < 2) {
      Alert.alert("Erro", "Nome deve ter pelo menos 2 caracteres!");
      return;
    }

    // Validação do CPF
    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido!");
      return;
    }

    // Validação do email
    if (!validarEmail(email)) {
      Alert.alert("Erro", "Email inválido!");
      return;
    }

    // Validação da senha
    if (senha.length < 6) {
      Alert.alert("Erro", "Senha deve ter pelo menos 6 caracteres!");
      return;
    }

    setLoading(true);

    try {
      console.log("API_URL:", API_URL);
      
      const response = await axios.post(`${API_URL}/cadastro/convidado`, {
        nome: nome.trim(),
        cpf: cpf.replace(/[^\d]/g, ''), // Remove formatação antes de enviar
        email: email.toLowerCase().trim(),
        senha,
      });

      console.log("Resposta do backend:", response.data);

      if (response.status === 201 || response.status === 200) {
        Alert.alert(
          "Sucesso", 
          "Cadastro realizado com sucesso!",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login")
            }
          ]
        );
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);

      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error;
        
        switch (statusCode) {
          case 400:
            Alert.alert("Erro", errorMessage || "Dados inválidos!");
            break;
          case 409:
            Alert.alert("Erro", "Este email ou CPF já está cadastrado!");
            break;
          case 422:
            Alert.alert("Erro", errorMessage || "Dados fornecidos são inválidos!");
            break;
          case 500:
            Alert.alert("Erro", "Erro interno do servidor. Tente novamente mais tarde.");
            break;
          default:
            Alert.alert("Erro", errorMessage || "Erro ao realizar cadastro.");
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
          color="#4525a4"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="NOME"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          autoCorrect={false}
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="badge"
          size={20}
          color="#4525a4"
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
          editable={!loading}
        />
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
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
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

      <TouchableOpacity onPress={handleCadastro} disabled={loading}>
        <LinearGradient 
          colors={loading ? ['#ccc', '#999'] : ['#4525a4', '#1868fd']} 
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.button, loading && styles.buttonDisabled]}
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
    paddingHorizontal: 100,
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