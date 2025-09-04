import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Descomente quando usar navegação

export default function Perfil() {
   const navigation = useNavigation(); // Descomente quando usar navegação

  // 🔹 Estados para dados do usuário
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    localizacao: '',
    idioma: '',
  });

  const [carregando, setCarregando] = useState(true);

  const [notificacoes, setNotificacoes] = useState({
    mensagensChat: false,
    mensagensDono: false,
    cancelamento: false,
    alteracoes: false,
  });

  // 🔹 Simula busca de dados do banco de dados
  useEffect(() => {
    buscarDadosUsuario();
  }, []);

  const buscarDadosUsuario = async () => {
    try {
      setCarregando(true);
      
      // 🔹 SIMULAÇÃO - substitua pela sua chamada real de API/banco
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede
      
      // Dados simulados do banco de dados
      const dadosSimulados = {
        nome: 'Nome do usuário',
        email: 'Usuario1@gmail.com',
        senha: '••••••••', // Sempre mascarada por segurança
        localizacao: 'Endereço do usuário',
        idioma: 'Português',
      };
      
      setDadosUsuario(dadosSimulados);
      
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
    } finally {
      setCarregando(false);
    }
  };

  const toggleSwitch = (key) => {
    setNotificacoes({ ...notificacoes, [key]: !notificacoes[key] });
  };

  // 🔹 Função para salvar alterações
  const salvarAlteracoes = async () => {
    try {
      Alert.alert('Salvando...', 'Suas alterações estão sendo salvas');
      
      // Simula salvamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Sucesso!', 'Alterações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    }
  };

  // 🔹 Função para voltar para página inicial
  const voltarPagInicial = () => {
    console.log('Voltando para página inicial...');
    navigation.navigate('PagInicial');
  };

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header com logo */}
      <View style={styles.header}>
        <Image source={require('../assets/Logo oficial.png')} style={styles.logo} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Avatar e nome do usuário */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Icon name="account" size={40} color="#4B5EFC" />
          </View>
          <Text style={styles.userName}>{dadosUsuario.nome}</Text>
        </View>

        {/* Informações do usuário */}
        <View style={styles.infoSection}>
          <InfoRow 
            icon="email-outline" 
            label="E-mail" 
            value={dadosUsuario.email} 
            showAlterButton
            onEdit={() => console.log('Editar email')}
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
            icon="web" 
            label="Idioma" 
            value={dadosUsuario.idioma} 
            showDropdown
            onEdit={() => console.log('Selecionar idioma')}
          />
        </View>

        {/* Seção de notificações */}
        <View style={styles.notificationSection}>
          <Text style={styles.notificationTitle}>Permitir notificações</Text>
          
          <View style={styles.notificationList}>
            <NotificacaoItem
              label="Mensagens do chat"
              value={notificacoes.mensagensChat}
              onValueChange={() => toggleSwitch('mensagensChat')}
            />
            <NotificacaoItem
              label="Mensagens do dono do evento"
              value={notificacoes.mensagensDono}
              onValueChange={() => toggleSwitch('mensagensDono')}
            />
            <NotificacaoItem
              label="Cancelamento de eventos"
              value={notificacoes.cancelamento}
              onValueChange={() => toggleSwitch('cancelamento')}
            />
            <NotificacaoItem
              label="Alterações em eventos"
              value={notificacoes.alteracoes}
              onValueChange={() => toggleSwitch('alteracoes')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Botões fixos no rodapé */}
      <View style={styles.footerButtons}>
        <LinearGradient 
          colors={['#4525a4', '#1868fd']} 
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.button}
        >
          <TouchableOpacity 
            style={styles.buttonTouchable}
            onPress={salvarAlteracoes}
          >
            <Text style={styles.buttonText}>Salvar alterações</Text>
          </TouchableOpacity>
        </LinearGradient>
        
        <LinearGradient 
          colors={['#4525a4', '#1868fd']} 
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.button}
        >
          <TouchableOpacity 
            style={styles.buttonTouchable}
            onPress={voltarPagInicial}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, showAlterButton, showDropdown, showEyeIcon, onEdit }) {
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color="#666" />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>{value || 'Não informado'}</Text>
      </View>
      <View style={styles.infoActions}>
        {showEyeIcon && (
          <Icon name="eye-outline" size={18} color="#666" style={styles.eyeIcon} />
        )}
        {showAlterButton && (
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.alterButton}>Alterar</Text>
          </TouchableOpacity>
        )}
        {showDropdown && (
          <TouchableOpacity onPress={onEdit}>
            <Icon name="chevron-down" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function NotificacaoItem({ label, value, onValueChange }) {
  return (
    <View style={styles.notificationRow}>
      <Text style={styles.notificationLabel}>{label}</Text>
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E5E5', true: '#4B5EFC' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4B5EFC',
    fontWeight: '600',
  },
  header: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  logo: { 
    width: 50,
    height: 40,
    resizeMode: 'contain',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4B5EFC',
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  infoSection: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  infoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginRight: 12,
  },
  alterButton: {
    color: '#4B5EFC',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationSection: {
    marginBottom: 30,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
    textAlign: 'left',
  },
  notificationList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 8,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  footerButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  button: {
    flex: 1,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonTouchable: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  perfilLabel: {
    backgroundColor: '#2D3748',
    paddingVertical: 8,
    alignItems: 'center',
  },
  perfilText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
