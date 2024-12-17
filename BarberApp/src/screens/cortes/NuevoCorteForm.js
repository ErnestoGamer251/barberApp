import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  HelperText,
  Searchbar,
} from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../config';

const NuevoCorteForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clienteId: '',
    tipoCorte: '',
    precio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clienteSearch, setClienteSearch] = useState('');
  const [showClienteResults, setShowClienteResults] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/clientes`);
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.clienteId || !formData.tipoCorte || !formData.precio) {
        setError('Por favor completa todos los campos');
        return;
      }

      setLoading(true);
      const result = await onSubmit(formData);
      
      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Limpiar formulario
      setFormData({
        clienteId: '',
        tipoCorte: '',
        precio: '',
      });
      setSelectedCliente(null);
      setClienteSearch('');
    } catch (error) {
      setError('Error al crear el corte');
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(clienteSearch.toLowerCase())
  );

  const handleSelectCliente = (cliente) => {
    setSelectedCliente(cliente);
    setFormData({ ...formData, clienteId: cliente._id });
    setClienteSearch(cliente.nombre);
    setShowClienteResults(false);
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Nuevo Corte</Text>

      <View style={styles.clienteSearch}>
        <Searchbar
          placeholder="Buscar cliente..."
          onChangeText={(text) => {
            setClienteSearch(text);
            setShowClienteResults(true);
            setSelectedCliente(null);
          }}
          value={clienteSearch}
        />
        
        {showClienteResults && clienteSearch && (
          <View style={styles.searchResults}>
            {filteredClientes.map(cliente => (
              <Button
                key={cliente._id}
                mode="text"
                onPress={() => handleSelectCliente(cliente)}
                style={styles.clienteItem}
              >
                {cliente.nombre}
              </Button>
            ))}
          </View>
        )}
      </View>

      <TextInput
        label="Tipo de Corte"
        value={formData.tipoCorte}
        onChangeText={text => setFormData({ ...formData, tipoCorte: text })}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Precio"
        value={formData.precio}
        onChangeText={text => setFormData({ ...formData, precio: text })}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      {error && (
        <HelperText type="error" visible={true}>
          {error}
        </HelperText>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.button}
        >
          Cancelar
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        >
          Crear Corte
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  clienteSearch: {
    marginBottom: 15,
  },
  searchResults: {
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 4,
    marginTop: 4,
    maxHeight: 200,
  },
  clienteItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    marginLeft: 10,
  },
});

export default NuevoCorteForm; 