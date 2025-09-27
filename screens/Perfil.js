import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Image, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function Perfil() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Estados para dados do usuário
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    localizacao: '',
    idioma: '',
    avatar: '',
    telefone: '',
    dataNascimento: ''
  });

  const [estatisticasUsuario, setEstatisticasUsuario] = useState({
    eventosParticipados: 0,
    eventosFavoritos: 0
  });

  const [carregando, setCarregando] = useState(true);

  const [notificacoes, setNotificacoes] = useState({
    mensagensChat: false,
    mensagensDono: false,
    cancelamento: false,
    alteracoes: false,
    lembretes: false,
    promocoes: false
  });

  // Função para buscar dados do usuário do backend
  const buscarDadosUsuario = async () => {
    try {
      setCarregando(true);
      
      // const response = await fetch('https://sua-api.com/usuario/perfil');
      // const data = await response.json();
      
      // Dados mockados que virão do backend
      const dadosSimulados = {
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: '••••••••',
        localizacao: 'São Paulo, SP - Brasil',
        idioma: 'Português (BR)',
        avatar: null,
        telefone: '(11) 99999-9999',
        dataNascimento: '15/03/1990'
      };
      
      const estatisticasSimuladas = {
        eventosParticipados: 28,
        eventosFavoritos: 12
      };
      
      setDadosUsuario(dadosSimulados);
      setEstatisticasUsuario(estatisticasSimuladas);
      
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    buscarDadosUsuario();
  }, []);

  const toggleSwitch = (key) => {
    setNotificacoes({ ...notificacoes, [key]: !notificacoes[key] });
  };

  const salvarAlteracoes = async () => {
    try {
      Alert.alert('Salvando...', 'Suas alterações estão sendo salvas');
      
      // const response = await fetch('https://sua-api.com/usuario/perfil', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ dadosUsuario, notificacoes })
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Sucesso!', 'Alterações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    }
  };

  const voltarPagInicial = () => {
    navigation.navigate('PagInicial');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => {
          // Lógica de logout
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
          });
        }}
      ]
    );
  };

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingContent}>
          <Icon name="account-circle" size={80} color="#4525a4" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header com gradiente */}
      <LinearGradient
        colors={['#4525a4', '#1868fd']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Seção do avatar e info básica */}
        <Animated.View 
          style={[
            styles.profileSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#4525a4', '#1868fd']}
              style={styles.avatarGradient}
            >
              <Icon name="account" size={60} color="#fff" />
            </LinearGradient>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="camera" size={16} color="#4525a4" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{dadosUsuario.nome}</Text>
          <Text style={styles.userEmail}>{dadosUsuario.email}</Text>
        </Animated.View>

        {/* Cards de estatísticas */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Icon name="calendar-check" size={24} color="#4525a4" />
              <Text style={styles.statNumber}>{estatisticasUsuario.eventosParticipados}</Text>
              <Text style={styles.statLabel}>Participados</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="heart" size={24} color="#e74c3c" />
              <Text style={styles.statNumber}>{estatisticasUsuario.eventosFavoritos}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          </View>
        </Animated.View>

        {/* Informações pessoais */}
        <Animated.View 
          style={[
            styles.infoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <InfoRow 
            icon="email-outline" 
            label="E-mail" 
            value={dadosUsuario.email} 
            showAlterButton
            onEdit={() => console.log('Editar email')}
          />
          <InfoRow 
            icon="phone-outline" 
            label="Telefone" 
            value={dadosUsuario.telefone}
            showAlterButton
            onEdit={() => console.log('Editar telefone')}
          />
          <InfoRow 
            icon="lock-outline" 
            label="Senha" 
            value={dadosUsuario.senha}
            showEyeIcon
            showAlterButton
            onEdit={() => console.log('Editar senha')}
          />
          <InfoRow 
            icon="map-marker-outline" 
            label="Localização" 
            value={dadosUsuario.localizacao}
            showAlterButton
            onEdit={() => console.log('Editar localização')}
          />
          <InfoRow 
            icon="cake-variant" 
            label="Data de Nascimento" 
            value={dadosUsuario.dataNascimento}
            showAlterButton
            onEdit={() => console.log('Editar data nascimento')}
          />
          <InfoRow 
            icon="web" 
            label="Idioma" 
            value={dadosUsuario.idioma} 
            showDropdown
            onEdit={() => console.log('Selecionar idioma')}
          />
        </Animated.View>

        {/* Seção de notificações */}
        <Animated.View 
          style={[
            styles.notificationSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Notificações</Text>
          
          <View style={styles.notificationCard}>
            <NotificacaoItem
              icon="chat"
              label="Mensagens do chat"
              value={notificacoes.mensagensChat}
              onValueChange={() => toggleSwitch('mensagensChat')}
            />
            <NotificacaoItem
              icon="account-star"
              label="Mensagens do organizador"
              value={notificacoes.mensagensDono}
              onValueChange={() => toggleSwitch('mensagensDono')}
            />
            <NotificacaoItem
              icon="cancel"
              label="Cancelamento de eventos"
              value={notificacoes.cancelamento}
              onValueChange={() => toggleSwitch('cancelamento')}
            />
            <NotificacaoItem
              icon="update"
              label="Alterações em eventos"
              value={notificacoes.alteracoes}
              onValueChange={() => toggleSwitch('alteracoes')}
            />
            <NotificacaoItem
              icon="bell-ring"
              label="Lembretes de eventos"
              value={notificacoes.lembretes}
              onValueChange={() => toggleSwitch('lembretes')}
            />
            <NotificacaoItem
              icon="tag"
              label="Ofertas e promoções"
              value={notificacoes.promocoes}
              onValueChange={() => toggleSwitch('promocoes')}
            />
          </View>
        </Animated.View>

        {/* Opções adicionais */}
        <Animated.View 
          style={[
            styles.optionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <TouchableOpacity style={styles.optionRow}>
            <Icon name="shield-account" size={24} color="#4525a4" />
            <Text style={styles.optionText}>Privacidade e Segurança</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionRow}>
            <Icon name="help-circle-outline" size={24} color="#4525a4" />
            <Text style={styles.optionText}>Ajuda e Suporte</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionRow}>
            <Icon name="information-outline" size={24} color="#4525a4" />
            <Text style={styles.optionText}>Sobre o App</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Botões de ação fixos */}
      <View style={styles.footerButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={voltarPagInicial}
        >
          <Icon name="home" size={20} color="#4525a4" />
          <Text style={styles.secondaryButtonText}>Início</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={salvarAlteracoes}
        >
          <LinearGradient 
            colors={['#4525a4', '#1868fd']} 
            style={styles.primaryGradient}
          >
            <Icon name="check" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Salvar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, showAlterButton, showDropdown, showEyeIcon, onEdit }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <Icon name={icon} size={20} color="#4525a4" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Não informado'}</Text>
      </View>
      <View style={styles.infoActions}>
        {showEyeIcon && (
          <TouchableOpacity style={styles.actionIcon}>
            <Icon name="eye-outline" size={18} color="#999" />
          </TouchableOpacity>
        )}
        {showAlterButton && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        )}
        {showDropdown && (
          <TouchableOpacity onPress={onEdit} style={styles.actionIcon}>
            <Icon name="chevron-down" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function NotificacaoItem({ icon, label, value, onValueChange }) {
  return (
    <View style={styles.notificationRow}>
      <View style={styles.notificationLeft}>
        <Icon name={icon} size={20} color="#4525a4" />
        <Text style={styles.notificationLabel}>{label}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ false: '#e9ecef', true: '#4525a4' }}
        thumbColor={value ? '#fff' : '#fff'}
        ios_backgroundColor="#e9ecef"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingContent: {
    alignItems: 'center',
    gap: 16,
  },
  
  loadingText: {
    fontSize: 16,
    color: '#4525a4',
    fontWeight: '600',
  },

  headerGradient: {
    paddingTop: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContainer: {
    flex: 1,
  },

  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 30,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 16,
    color: '#7f8c8d',
  },

  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },

  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    fontWeight: '600',
  },

  infoSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  notificationSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  optionsSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },

  infoIconContainer: {
    width: 40,
    alignItems: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 14,
    color: '#7f8c8d',
  },

  infoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  actionIcon: {
    padding: 4,
  },

  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  editButtonText: {
    color: '#4525a4',
    fontSize: 12,
    fontWeight: '600',
  },

  notificationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 4,
  },

  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  notificationLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 16,
    fontWeight: '500',
  },

  footerButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    gap: 12,
  },

  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },

  secondaryButtonText: {
    color: '#4525a4',
    fontSize: 16,
    fontWeight: '600',
  },

  primaryGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 20,
  },
});