import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native'; 



export default function PaginaQrCode() {
  const [text] = useState('https://www.google.com/imgres?q=metal%20sonic%20farmando%20aura&imgurl=https%3A%2F%2Fi.redd.it%2Fso-does-metal-sonic-try-to-aura-farm-or-does-it-just-kinda-v0-6f9kulupq8ie1.jpg%3Fwidth%3D1170%26format%3Dpjpg%26auto%3Dwebp%26s%3D8b76d3c36aa62a27c4ede05f0d8e026593930305&imgrefurl=https%3A%2F%2Fwww.reddit.com%2Fr%2FMoonPissing%2Fcomments%2F1ily1y7%2Fso_does_metal_sonic_try_to_aura_farm_or_does_it%2F%3Ftl%3Dpt-br&docid=1YYFwL-DS60laM&tbnid=kKHeHUlDaYtvdM&vet=12ahUKEwjUnsr1zsmPAxX7PrkGHS3vAdYQM3oECCAQAA..i&w=1170&h=1277&hcb=2&ved=2ahUKEwjUnsr1zsmPAxX7PrkGHS3vAdYQM3oECCAQAA');
  const qrRef = useRef();
  const navigation = useNavigation(); 
  const salvarQrCode = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Ative as permissões de mídia para salvar o QR Code.');
        return;
      }

      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Sucesso!', 'QR Code salvo na galeria.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o QR Code.');
      console.error(error);
    }
  };

  const Voltar = () => {
    navigation.navigate('ParticiparEvento', {
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/Logo oficial.png')} style={styles.logo} />
        <Icon name="person-circle-outline" size={36} color="#4B4BE0" />
      </View>

      {/* Gradient box */}
      <LinearGradient colors={['#4f46e5', '#3b82f6']} style={styles.gradientBox}>
        <Text style={styles.eventTitle}>Nome do evento</Text>
        <Text style={styles.eventType}>Tipo de evento</Text>

        <View style={styles.qrContainer} ref={qrRef}>
          <QRCode value={text} size={180} color="black" backgroundColor="white" />
        </View>

        <Text style={styles.info}>Tipo de ingresso:</Text>
        <Text style={styles.info}>Compras adicionais:</Text>
      </LinearGradient>

      {/* Footer buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('ParticiparEvento')}>
          
          <Text style={styles.buttonOutlineText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={salvarQrCode}>
          <LinearGradient colors={['#4f46e5', '#3b82f6']} style={styles.buttonGradient}>
            <Text style={styles.buttonGradientText}>Salvar QR Code</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  gradientBox: {
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  eventType: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    marginBottom: 15,
  },
  qrContainer: {
    width: 220,
    height: 220,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 15,
  },
  info: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  buttonOutline: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4B4BE0',
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: '#4B4BE0',
    fontFamily: 'Montserrat-Bold',
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonGradientText: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
});
