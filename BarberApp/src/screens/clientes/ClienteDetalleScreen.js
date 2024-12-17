import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  ActivityIndicator,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../config';

const ClienteDetalleScreen = ({ route, navigation }) => {
  const { clienteId } = route.params;
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
  });

  const fetchCliente = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/clientes/${clienteId}`);
      setCliente(response.data);
      setFormData({
        nombre: response.data.nombre,
        telefono: response.data.telefono,
        email: response.data.email || '',
      });
    } catch (error) {
      console.error('Error al obtener cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCliente();
  }, [clienteId]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/api/clientes/${clienteId}`,
        formData
      );
      setCliente(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Información del Cliente</Title>
          {editMode ? (
            <View>
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
                style={styles.input}
              />
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={text => setFormData({ ...formData, email: text })}
                mode="outlined"
                style={styles.input}
              />
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => setEditMode(false)}
                  style={styles.button}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleUpdate}
                  style={styles.button}
                >
                  Guardar
                </Button>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{cliente.nombre}</Text>
              
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{cliente.telefono}</Text>
              
              {cliente.email && (
                <>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{cliente.email}</Text>
                </>
              )}
              
              <Button
                mode="contained"
                onPress={() => setEditMode(true)}
                style={styles.editButton}
              >
                Editar Información
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Historial de Cortes</Title>
          {cliente.historialCortes?.map((corte) => (
            <View key={corte._id} style={styles.corteItem}>
              <Text>Fecha: {new Date(corte.fecha).toLocaleDateString()}</Text>
              <Text>Tipo: {corte.tipoCorte}</Text>
              <Text>Precio: ${corte.precio}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
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
  card: {
    margin: 10,
    elevation: 4,
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    marginLeft: 10,
  },
  editButton: {
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    marginBottom: 5,
  },
  corteItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
});

export default ClienteDetalleScreen; 