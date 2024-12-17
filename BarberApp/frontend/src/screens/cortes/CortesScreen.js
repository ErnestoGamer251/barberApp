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
  Button,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import NuevoCorteForm from './NuevoCorteForm';

const CortesScreen = () => {
  const { user } = useAuth();
  const [cortes, setCortes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchCortes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cortes`);
      setCortes(response.data);
    } catch (error) {
      console.error('Error al obtener cortes:', error);
      setError('Error al cargar los cortes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCortes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCortes();
    setRefreshing(false);
  };

  const handleCreateCorte = async (corteData) => {
    try {
      const response = await axios.post(`${API_URL}/api/cortes`, corteData);
      setCortes([response.data, ...cortes]);
      setModalVisible(false);
      return { success: true };
    } catch (error) {
      console.error('Error al crear corte:', error);
      setError('Error al crear el corte');
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al crear el corte' 
      };
    }
  };

  const filteredCortes = cortes.filter(corte =>
    corte.cliente?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    corte.tipoCorte.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCorteItem = ({ item }) => (
    <Card style={styles.corteCard}>
      <Card.Content>
        <View style={styles.corteHeader}>
          <View>
            <Text style={styles.clienteName}>
              Cliente: {item.cliente?.nombre}
            </Text>
            <Text style={styles.tipoCorte}>
              Tipo: {item.tipoCorte}
            </Text>
          </View>
          <Text style={styles.precio}>
            ${item.precio}
          </Text>
        </View>
        <View style={styles.corteInfo}>
          <Text style={styles.fecha}>
            {new Date(item.fecha).toLocaleDateString()}
          </Text>
          <Text style={styles.peluquero}>
            Peluquero: {item.peluquero?.nombre}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar corte..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredCortes}
        renderItem={renderCorteItem}
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
          <NuevoCorteForm
            onSubmit={handleCreateCorte}
            onCancel={() => setModalVisible(false)}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchbar: {
    margin: 10,
    elevation: 4,
  },
  listContainer: {
    padding: 10,
  },
  corteCard: {
    marginBottom: 10,
    elevation: 2,
  },
  corteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clienteName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipoCorte: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  precio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  corteInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  fecha: {
    fontSize: 14,
    color: '#666',
  },
  peluquero: {
    fontSize: 14,
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
    maxHeight: '80%',
  },
});

export default CortesScreen; 