import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PaginaPagamentos() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventoId, valor, nomeEvento } = route.params;

  const [cupom, setCupom] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceDetails, setPriceDetails] = useState({
    subtotal: valor,
    desconto: 0,
    taxas: 5.00,
    total: valor + 5.00,
  });

  const [paymentMethod, setPaymentMethod] = useState('pix');

  useEffect(() => {
    // Simular a aplicação de um cupom
    const aplicarCupom = () => {
      let novoDesconto = 0;
      if (cupom.toLowerCase() === 'simulacao10') { // Cupom de simulação
        novoDesconto = priceDetails.subtotal * 0.10;
      }
      const novoTotal = priceDetails.subtotal + priceDetails.taxas - novoDesconto;
      setPriceDetails(prev => ({
        ...prev,
        desconto: novoDesconto,
        total: novoTotal,
      }));
    };
    aplicarCupom();
  }, [cupom, priceDetails.subtotal, priceDetails.taxas]);

  const handlePayment = () => {
    setLoading(true);
    // Simulação de um delay de processamento
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Pagamento Simulado com Sucesso! 🎉',
        `Seu ingresso para o evento "${nomeEvento}" foi confirmado. Este é apenas um teste, nenhum valor foi cobrado.`
      );
      // Você pode navegar para uma tela de confirmação de sucesso
      // navigation.navigate('ConfirmacaoPagamento');
    }, 2000); // Delay de 2 segundos para simular o processamento
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#4B4BE0" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Pagamento do Ingresso</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.infoEventoCard}>
          <Text style={styles.eventoNome}>{nomeEvento}</Text>
          <Text style={styles.eventoValor}>R$ {valor.toFixed(2)}</Text>
        </View>

        <Text style={styles.subtitulo}>Selecione um método de pagamento</Text>
        <View style={styles.paymentMethodsContainer}>
          {['pix', 'cartao'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentMethodCard,
                paymentMethod === method && styles.paymentMethodCardActive,
              ]}
              onPress={() => setPaymentMethod(method)}
              activeOpacity={0.8}
            >
              <View style={styles.methodIconContainer}>
                {method === 'pix' ? (
                  <Icon name="qrcode-scan" size={24} color={paymentMethod === 'pix' ? '#fff' : '#4B4BE0'} />
                ) : (
                  <Icon name="credit-card-outline" size={24} color={paymentMethod === 'cartao' ? '#fff' : '#4B4BE0'} />
                )}
              </View>
              <Text style={[
                styles.methodText,
                paymentMethod === method && { color: '#fff' }
              ]}>
                {method === 'pix' ? 'Pix' : 'Cartão de Crédito'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.label}>Cupom de Desconto</Text>
        <TextInput
          style={styles.input}
          value={cupom}
          onChangeText={setCupom}
          placeholder="Digite o cupom de simulação (simulacao10)"
          placeholderTextColor="#9ca3af"
        />

        <View style={styles.resumoContainer}>
          <Text style={styles.resumoTitulo}>Detalhes da Compra</Text>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Preço:</Text>
            <Text style={styles.resumoValue}>R$ {priceDetails.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Taxas:</Text>
            <Text style={styles.resumoValue}>R$ {priceDetails.taxas.toFixed(2)}</Text>
          </View>
          <View style={styles.resumoRow}>
            <Text style={[styles.resumoLabel, { color: '#10b981' }]}>Desconto:</Text>
            <Text style={[styles.resumoValue, { color: '#10b981' }]}>- R$ {priceDetails.desconto.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabelTotal}>Total a Pagar:</Text>
            <Text style={styles.resumoValueTotal}>R$ {priceDetails.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtonContainer}>
        <LinearGradient
          colors={['#4B4BE0', '#6F86FF']}
          style={styles.gradientButton}
        >
          <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pagar Agora (Simulação)</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  infoEventoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  eventoNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  eventoValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B4BE0',
    marginTop: 8,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  paymentMethodCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  paymentMethodCardActive: {
    borderColor: '#4B4BE0',
    backgroundColor: '#4B4BE0',
  },
  methodIconContainer: {
    marginBottom: 8,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 24,
  },
  resumoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resumoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  resumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resumoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  resumoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  resumoLabelTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  resumoValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B4BE0',
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  gradientButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});