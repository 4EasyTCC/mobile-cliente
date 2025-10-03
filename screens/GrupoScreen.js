import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env"; 
import { useFocusEffect, useNavigation } from "@react-navigation/native"; 
const FALLBACK_API_URL = 'http://10.80.220.253:3000';
const BASE_URL = API_URL || FALLBACK_API_URL;
// **********************************************

// Função auxiliar para obter o Token JWT (do convidado)
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@user_token');
    return token;
  } catch (e) {
    console.error("Erro ao ler token do AsyncStorage:", e);
    return null;
  }
};

const theme = { 
  colors: {
    primary: "#5847E3", 
    background: "#f7f6fb",
    textPrimary: "#1f2937",
    textSecondary: "#6b7280",
    white: "#fff",
    surface: "#e5e7eb",
  },
  spacing: {
    md: 16,
    lg: 20,
  },
  borderRadius: {
    lg: 12,
  }
};


export default function GrupoScreen() { // <-- CORRIGIDO NOME DA FUNÇÃO
  const navigation = useNavigation();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchGrupos = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      setLoading(false);
      Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
      navigation.navigate('Login'); 
      return;
    }

    try {
      console.log(`[CHAT LIST] Buscando grupos em: ${BASE_URL}/grupos/convidado`);
      // NOVA ROTA: Listar os grupos que o convidado pertence
      const response = await axios.get(`${BASE_URL}/grupos/convidado`, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setGrupos(response.data.grupos || []); 

    } catch (error) {
      // Se for um erro de rede, exibe a mensagem de conexão
      if (axios.isAxiosError(error) && !error.response) {
          Alert.alert("Erro de Conexão", `Não foi possível conectar ao servidor. Verifique se o backend está ativo e o BASE_URL (${BASE_URL}) está correto.`);
      } else {
          console.error("Erro ao buscar grupos:", error.response ? error.response.data : error.message);
          Alert.alert("Erro", "Não foi possível carregar a lista de chats: " + (error.response?.data?.message || "Erro desconhecido."));
      }
      
      setGrupos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGrupos();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchGrupos();
  };

  const filtrarGrupos = () => {
    if (searchText.trim()) {
      const termo = searchText.toLowerCase();
      return grupos.filter(
        (grupo) =>
          grupo.nome.toLowerCase().includes(termo) ||
          grupo.eventoNome.toLowerCase().includes(termo)
      );
    }
    return grupos;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => 
        // Navega para a tela de conversa, usando o nome da tela que você já tem
        navigation.navigate('Chat', { // Ajuste o nome da sua tela de conversa se for diferente de 'Chat'
            grupoId: item.grupoId, 
            grupoNome: item.nome, 
        })
      }
    >
      <View style={styles.avatar}>
        <Ionicons name="chatbubbles-outline" size={24} color={theme.colors.white} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.grupoNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.eventoNome} numberOfLines={1}>Evento: {item.eventoNome || "Chat Geral"}</Text>
        <Text style={styles.ultimaMensagem} numberOfLines={1}>Toque para ver a conversa...</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  
  if (loading && grupos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando seus chats...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Seus Grupos de Eventos</Text>
        <TextInput 
            style={styles.searchBar} 
            placeholder="Buscar grupo..." 
            placeholderTextColor={theme.colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
        />
        
        <FlatList
          data={filtrarGrupos()}
          renderItem={renderItem}
          keyExtractor={(item) => item.grupoId.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-outline" size={50} color={theme.colors.textSecondary} style={{ marginBottom: 15 }} />
                <Text style={styles.emptyText}>Você ainda não faz parte de nenhum grupo de chat. Participe de um evento para começar!</Text>
            </View>
          )}
        />
      </View>
      {/* Aqui deve haver sua BottomNavBar que navega para esta tela, geralmente com o nome 'Chat' */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  searchBar: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: theme.spacing.lg,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.surface,
    color: theme.colors.textPrimary
  },
  listContent: {
    paddingBottom: 100, // Espaço para a barra de navegação inferior
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  grupoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  eventoNome: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  ultimaMensagem: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg * 2,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.textPrimary,
  }
});