import React, { useCallback } from 'react';
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
} from '@mui/material';
import useFetchData from '../../hooks/useFetchData';
import { useMantenimientoState } from '../../hooks/useMantenimientoState';
import { useMantenimientoFilters } from '../../hooks/useMantenimientoFilters';
import { MantenimientoFilters } from './Filtros/MantenimientoFilters';
import MantenimientoList from './MantenimientoList';
import { API_URL } from '../../config';

const groupBySolicitud = (mantenimientos) => {
  return mantenimientos.reduce((groups, mantenimiento) => {
    const solicitudId = mantenimiento.IdSolicitud;
    if (!groups[solicitudId]) {
      groups[solicitudId] = [];
    }
    groups[solicitudId].push(mantenimiento);
    return groups;
  }, {});
};

const HistorialMantenimientos = () => {
  // Fetch data hooks with polling for real-time updates
  const { 
    data: mantenimientos, 
    isLoading: isLoadingMantenimientos, 
    error: errorMantenimientos, 
    refetch: refetchMantenimientos 
  } = useFetchData(`${API_URL}/mantenimientos`, 5000); // Reduced poll time to 5 seconds

  const { 
    data: equipos, 
    isLoading: isLoadingEquipos, 
    error: errorEquipos, 
    refetch: refetchEquipos 
  } = useFetchData(`${API_URL}/equipos`, 5000);

  const { 
    data: solicitudes, 
    isLoading: isLoadingSolicitudes, 
    error: errorSolicitudes, 
    refetch: refetchSolicitudes 
  } = useFetchData(`${API_URL}/solicitudes`, 5000);

  // Custom hooks for state and filters
  const mantenimientoState = useMantenimientoState(mantenimientos, equipos);
  const mantenimientoFilters = useMantenimientoFilters();

  // Callback for refreshing all data
  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([
        refetchMantenimientos(),
        refetchEquipos(),
        refetchSolicitudes()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [refetchMantenimientos, refetchEquipos, refetchSolicitudes]);

  // Data processing
  const filteredMantenimientos = mantenimientoFilters.applyFilters(
    mantenimientoState.mantenimientosConEquipos
  );
  const groupedMantenimientos = groupBySolicitud(filteredMantenimientos);

  const isLoading = isLoadingMantenimientos || isLoadingEquipos || isLoadingSolicitudes;
  const error = errorMantenimientos || errorEquipos || errorSolicitudes;

  // Loading state handler
  if (isLoading && !groupedMantenimientos) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error state handler
  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          {error?.message || 'Error al cargar los datos'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Historial de Mantenimientos
          </Typography>
        </Box>
        
        <MantenimientoFilters filters={mantenimientoFilters} />
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <MantenimientoList 
          groupedMantenimientos={groupedMantenimientos}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          solicitudes={solicitudes || []}
          equipos={equipos || []}
        />
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default HistorialMantenimientos;