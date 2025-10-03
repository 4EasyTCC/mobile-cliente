// Login.js
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator, // Adicionado para melhor UX de loading
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { API_URL } from "@env"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; // Adicionado AsyncStorage

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
            if (!email || !senha) {
            Alert.alert("Erro", "Preencha todos os campos!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login/convidado`, {
                email: email.toLowerCase().trim(),
                senha,
            });

            if (response.status === 200 && response.data.token) {
                const { token, convidado } = response.data;

await AsyncStorage.setItem('@user_token', token);
await AsyncStorage.setItem('@user_data', JSON.stringify(convidado));

await AsyncStorage.setItem('@user_type', 'convidado'); // <-- Esta chave é vital!
                
                Alert.alert("Sucesso", `Bem-vindo(a), ${convidado.nome}!`);
                navigation.replace("PagInicial"); 
            } else {
                Alert.alert("Erro", "Resposta de login incompleta.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || "Email ou senha incorretos.";
            Alert.alert("Erro", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* O caminho da imagem pode precisar de ajuste: '../assets/Logo4easy.jpeg' */}
            <Image source={require("../assets/Logo4easy.jpeg")} style={styles.logo} /> 

            <View style={styles.tabContainer}>
                <Text style={styles.activeTab}>LOGIN</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
                    <Text style={styles.inactiveTab}>CADASTRAR</Text>
                </TouchableOpacity>
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

            <TouchableOpacity onPress={handleLogin} disabled={loading}>
                <LinearGradient
                    colors={loading ? ["#ccc", "#999"] : ["#4525a4", "#1868fd"]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={[styles.button, styles.shadow, loading && styles.buttonDisabled]}
                >
                    <Text style={styles.buttonText}>
                        {loading ? <ActivityIndicator color="#fff" /> : "ENTRAR"}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("Cadastro")}
                disabled={loading}
            >
                <Text style={styles.footer}>
                    Não tem uma conta? <Text style={styles.link}>Cadastre-se</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// O objeto styles permanece o mesmo, mas aqui está ele para referência
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