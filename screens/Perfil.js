import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Perfil() {
  const [notificacoes, setNotificacoes] = useState({
    mensagensChat: false,
    mensagensDono: false,
    cancelamento: false,
    alteracoes: false,
  });

  const toggleSwitch = (key) => {
    setNotificacoes({ ...notificacoes, [key]: !notificacoes[key] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/Logo oficial.png')} style={styles.logo} />

      <View style={styles.avatar}>
        <Icon name="account-circle" size={80} color="#4B4BE0" />
        <Text style={styles.userName}>Nome do usuário</Text>
      </View>

      <View style={styles.infoContainer}>
        <InfoRow icon="email" label="E-mail" value="usuario1@gmail.com" />
        <InfoRow icon="lock" label="Senha" value="********" />
        <InfoRow icon="map-marker" label="Localização" value="Endereço do usuário" />
        <InfoRow icon="web" label="Idioma" value="Português" dropdown />
      </View>

      <Text style={styles.notificacaoTitulo}>Permitir notificações</Text>
      <View style={styles.switchContainer}>
        <NotificacaoSwitch
          label="Mensagens de chat"
          value={notificacoes.mensagensChat}
          onValueChange={() => toggleSwitch('mensagensChat')}
        />
        <NotificacaoSwitch
          label="Mensagens do dono do evento"
          value={notificacoes.mensagensDono}
          onValueChange={() => toggleSwitch('mensagensDono')}
        />
        <NotificacaoSwitch
          label="Cancelamento de eventos"
          value={notificacoes.cancelamento}
          onValueChange={() => toggleSwitch('cancelamento')}
        />
        <NotificacaoSwitch
          label="Alterações em eventos"
          value={notificacoes.alteracoes}
          onValueChange={() => toggleSwitch('alteracoes')}
        />
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.buttonText}>Salvar alterações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


function InfoRow({ icon, label, value, dropdown }) {
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color="#4B4BE0" />
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={styles.infoText}>{label}: {value}</Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.alterarText}>{dropdown ? '▼' : 'Alterar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function NotificacaoSwitch({ label, value, onValueChange }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#F4F4F4',
    flexGrow: 1,
  },
  logo: { 
    width: 60,
     height: 60,
      resizeMode: 'contain' 
    },
  avatar: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DDD',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  alterarText: {
    color: '#4B4BE0',
    fontWeight: 'bold',
  },
  notificacaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
  switchContainer: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4B4BE0',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  backButton: {
    backgroundColor: '#4B4BE0',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
