import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  Portal,
  Modal,
  TextInput,
  Snackbar,
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config';

const PerfilScreen = () => {
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nombre: user.nombre,
    email: user.email,
    password: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async () => {
    try {
      if (formData.password && formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      setLoading(true);
      const updateData = {
        nombre: formData.nombre,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await axios.put(`${API_URL}/api/perfil`, updateData);
      setSuccess('Perfil actualizado correctamente');
      setModalVisible(false);
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={80}
            label={user.nombre.substring(0, 2).toUpperCase()}
          />
        </View>

        <Card.Content>
          <Text style={styles.name}>{user.nombre}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.role}>
            {user.rol === 'admin' ? 'Administrador' : 'Peluquero'}
          </Text>

          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={styles.editButton}
          >
            Editar Perfil
          </Button>

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            Cerrar Sesión
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Editar Perfil</Text>

          <TextInput
            label="Nombre"
            value={formData.nombre}
            onChangeText={text => setFormData({ ...formData, nombre: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Nueva Contraseña (opcional)"
            value={formData.password}
            onChangeText={text => setFormData({ ...formData, password: text })}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            label="Confirmar Nueva Contraseña"
            value={formData.confirmPassword}
            onChangeText={text => setFormData({ ...formData, confirmPassword: text })}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleUpdateProfile}
              loading={loading}
              style={styles.modalButton}
            >
              Guardar
            </Button>
          </View>
        </Modal>
      </Portal>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>

      <Snackbar
        visible={!!success}
        onDismiss={() => setSuccess('')}
        duration={3000}
        style={styles.successSnackbar}
      >
        {success}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 10,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  role: {
    fontSize: 14,
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'uppercase',
  },
  editButton: {
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  modalButton: {
    marginLeft: 10,
  },
  successSnackbar: {
    backgroundColor: '#4CAF50',
  },
});

export default PerfilScreen; 