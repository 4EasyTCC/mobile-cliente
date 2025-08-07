import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function EsquecerSenha({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo4easy.jpeg')} style={styles.logo} />
      <Text style={styles.titulo}>Solicitar nova senha</Text>

      <TextInput style={styles.input} placeholder="EMAIL" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="NOVA SENHA" secureTextEntry placeholderTextColor="#aaa" />

      <TouchableOpacity style={styles.botao}>
        <Text style={styles.botaoTexto}>Enviar E-mail</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.textoBaixo}>
          não possui uma conta? <Text style={styles.link}>cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor: '#fff', padding: 20 },
  logo: { width: 180, height: 180, resizeMode: 'contain', marginBottom: 20 },
  titulo: { fontSize: 18, color: '#4a00e0', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#eee', padding: 15, borderRadius: 8, marginBottom: 15 },
  botao: { width: '100%', padding: 15, backgroundColor: '#4a00e0', borderRadius: 8 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  textoBaixo: { marginTop: 20, color: '#999', fontSize: 12 },
  link: { color: '#4a00e0' }
});
