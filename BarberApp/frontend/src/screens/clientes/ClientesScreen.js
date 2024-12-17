import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  FAB,
  Searchbar,
  Card,
  Portal,
  Modal,
  TextInput,
  Button,
  Snackbar,
} from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../config';

const ClientesScreen = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
  });

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/clientes`);
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClientes();
    setRefreshing(false);
  };

  const handleCreateCliente = async () => {
    try {
      if (!formData.nombre || !formData.telefono) {
        setError('Nombre y teléfono son requeridos');
        return;
      }

      const response = await axios.post(`${API_URL}/api/clientes`, formData);
      setClientes([response.data, ...clientes]);
      setModalVisible(false);
      setFormData({ nombre: '', telefono: '', email: '' });
    } catch (error) {
      console.error('Error al crear cliente:', error);
      setError('Error al crear el cliente');
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cliente.telefono.includes(searchQuery)
  );

  const renderClienteItem = ({ item }) => (
    <Card style={styles.clienteCard}>
      <Card.Content>
        <Text style={styles.clienteName}>{item.nombre}</Text>
        <Text>Teléfono: {item.telefono}</Text>
        {item.email && <Text>Email: {item.email}</Text>}
        <Text style={styles.cortesCount}>
          Total de cortes: {item.historialCortes?.length || 0}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar cliente..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredClientes}
        renderItem={renderClienteItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Nuevo Cliente</Text>
          
          <TextInput
            label="Nombre"
            value={formData.nombre}
            onChangeText={text => setFormData({ ...formData, nombre: text })}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Teléfono"
            value={formData.telefono}
            onChangeText={text => setFormData({ ...formData, telefono: text })}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />
          
          <TextInput
            label="Email (opcional)"
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
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
              onPress={handleCreateCliente}
              style={styles.modalButton}
            >
              Crear
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 10,
    elevation: 4,
  },
  listContainer: {
    padding: 10,
  },
  clienteCard: {
    marginBottom: 10,
    elevation: 2,
  },
  clienteName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cortesCount: {
    marginTop: 5,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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
});

export default ClientesScreen; 