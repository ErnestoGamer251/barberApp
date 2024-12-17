import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext';

const DashboardScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const endpoint = user.rol === 'admin' 
        ? `${API_URL}/api/dashboard`
        : `${API_URL}/api/dashboard/peluquero`;
      
      const response = await axios.get(endpoint);
      setStats(response.data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.welcome}>
        Bienvenido, {user.nombre}
      </Text>

      {user.rol === 'admin' ? (
        // Vista de administrador
        <View>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Estadísticas Generales</Title>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Paragraph>Total Clientes</Paragraph>
                  <Text style={styles.statNumber}>{stats?.totalClientes || 0}</Text>
                </View>
                <View style={styles.statItem}>
                  <Paragraph>Total Peluqueros</Paragraph>
                  <Text style={styles.statNumber}>{stats?.totalPeluqueros || 0}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Ingresos</Title>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Paragraph>Total Cortes</Paragraph>
                  <Text style={styles.statNumber}>
                    {stats?.estadisticasGenerales?.totalCortes || 0}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Paragraph>Ingreso Total</Paragraph>
                  <Text style={styles.statNumber}>
                    ${stats?.estadisticasGenerales?.ingresoTotal || 0}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      ) : (
        // Vista de peluquero
        <View>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Mis Estadísticas</Title>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Paragraph>Cortes Realizados</Paragraph>
                  <Text style={styles.statNumber}>
                    {stats?.estadisticasGenerales?.totalCortes || 0}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Paragraph>Ingresos Totales</Paragraph>
                  <Text style={styles.statNumber}>
                    ${stats?.estadisticasGenerales?.ingresoTotal || 0}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Últimos Cortes</Title>
              {stats?.cortesRecientes?.map((corte, index) => (
                <View key={corte._id} style={styles.corteItem}>
                  <Text>{corte.cliente.nombre}</Text>
                  <Text>${corte.precio}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>
      )}
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
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  corteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default DashboardScreen; 