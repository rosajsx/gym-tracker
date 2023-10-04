import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Button } from '../../components/Button/index';
import { Input } from '../../components/Input/index';
import { Modal } from '../../components/Modal';
import { DismissKeyboard } from '../../components/DismissKeyboard';
import { useAuth } from '../../contexts/auth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isLoading, error, clearError } = useAuth();

  return (
    <DismissKeyboard style={{ flex: 1 }}>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size='large' color='#A0DDE6' />
        ) : (
          <>
            <Text style={styles.title}>Entre com seus dados</Text>
            <Input
              placeholder='Digite seu e-mail'
              keyboardType='email-address'
              onChangeText={setEmail}
              placeholderTextColor='#7C7C8A'
            />
            <Input
              placeholder='Digite sua senha'
              secureTextEntry
              onChangeText={setPassword}
              placeholderTextColor='#7C7C8A'
            />
            <Button title='Entrar' onPress={() => signIn(email, password)} />
          </>
        )}

        <Modal visible={!!error} onRequestClose={clearError}>
          <View style={styles.modal}>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        </Modal>
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 16,
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 8,
    backgroundColor: '#202024',
  },
  title: {
    textAlign: 'center',
    color: '#E1E1E6',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 8,
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
