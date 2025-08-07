import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaginaPagamentos() {
  const [cupom, setCupom] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
      <Image source={require('../assets/Logo oficial.png')} style={styles.logo} resizeMode="contain"/>
        <TouchableOpacity style={styles.perfilIcon}>
        <Icon name="account-circle-outline" size={32} color="#4B4BE0" />
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Selecione uma forma de Pagamento</Text>

      {/* Botões de pagamento com gradiente */}
      {['Cartão', 'Boleto', 'Pix'].map((item, index) => (
        <LinearGradient
          key={index}
          colors={['#4B4BE0', '#6F86FF']}
          style={styles.botaoPagamento}
        >
          <TouchableOpacity style={styles.botaoInterno}>
            <Text style={styles.textoBotao}>{item}</Text>
          </TouchableOpacity>
        </LinearGradient>
      ))}

      {/* Cupom */}
      <Text style={styles.label}>Cupons:</Text>
      <TextInput
        style={styles.input}
        value={cupom}
        onChangeText={setCupom}
        placeholder="Digite o cupom"
      />

      {/* Valores */}
      <View style={styles.infoBox}>
        <Text style={styles.info}>Preço:</Text>
        <Text style={styles.info}>Outros:</Text>
        <Text style={styles.info}>Desconto:</Text>
        <Text style={styles.info}>Preço Final:</Text>
      </View>

      {/* Botão Pagar */}
      <LinearGradient
        colors={['#4B4BE0', '#6F86FF']}
        style={styles.botaoPagamento}
      >
        <TouchableOpacity style={styles.botaoInterno}>
          <Text style={styles.textoBotao}>Pagar</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 50,
  },
  perfilIcon: {
    padding: 8,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2D2D2D',
  },
  botaoPagamento: {
    borderRadius: 25,
    marginVertical: 8,
  },
  botaoInterno: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 10,
  },
  infoBox: {
    marginTop: 10,
    marginBottom: 30,
  },
  info: {
    fontSize: 14,
    marginVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
});
