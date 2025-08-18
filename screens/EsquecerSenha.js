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

export default function EsquecerSenha({ navigation }) {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo4easy.jpeg')} style={styles.logo} />
      <View style={styles.tabContainer}>
        <Text style={styles.activeTab}>
          SOLICITAR NOVA SENHA
        </Text>
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
          value={novaSenha}
          onChangeText={setNovaSenha}
        />
      </View>

      <TouchableOpacity>
        <LinearGradient 
        colors={['#4525a4', '#1868fd']} 
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.button}
        >
          <Text style={styles.buttonText}>ENVIAR E-MAIL</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
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
    paddingHorizontal: 100,
    borderRadius: 10,
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
    color: "#007aff",
    fontWeight: "bold",
  },
});
