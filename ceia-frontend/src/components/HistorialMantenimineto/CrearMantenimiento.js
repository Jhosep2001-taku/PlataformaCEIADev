import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Autocomplete
} from '@mui/material';
import axiosInstance from '../../axiosConfig';

const CrearMantenimiento = ({ solicitudId, onMantenimientoCreado }) => {
  const [formData, setFormData] = useState({
    DescripcionTrabajo: '',
    TipoTrabajo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tiposTrabajoExistentes, setTiposTrabajoExistentes] = useState([]);

  useEffect(() => {
    const cargarTiposTrabajoExistentes = async () => {
      try {
        const response = await axiosInstance.get('/mantenimientos');
        const mantenimientos = response.data;
        
        // Filtrar mantenimientos por IdSolicitud y extraer tipos únicos
        const tiposUnicos = [...new Set(
          mantenimientos
            .filter(m => m.IdSolicitud === parseInt(solicitudId))
            .map(m => m.TipoTrabajo)
        )].filter(tipo => tipo); // Eliminar valores vacíos
        
        setTiposTrabajoExistentes(tiposUnicos);
      } catch (error) {
        console.error('Error al cargar tipos de trabajo:', error);
      }
    };

    if (solicitudId) {
      cargarTiposTrabajoExistentes();
    }
  }, [solicitudId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const currentDate = new Date().toISOString().split('T')[0];

    const nuevoMantenimiento = {
      FechaMantenimiento: currentDate,
      DescripcionTrabajo: formData.DescripcionTrabajo,
      TipoTrabajo: formData.TipoTrabajo,
      IdSolicitud: parseInt(solicitudId),
      IdEquipo: null
    };

    try {
      await axiosInstance.post('/mantenimientos', nuevoMantenimiento);
      onMantenimientoCreado();
      setFormData({ DescripcionTrabajo: '', TipoTrabajo: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear el mantenimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Autocomplete
        freeSolo
        options={tiposTrabajoExistentes}
        value={formData.TipoTrabajo}
        onChange={(event, newValue) => {
          setFormData({ ...formData, TipoTrabajo: newValue || '' });
        }}
        onInputChange={(event, newInputValue) => {
          setFormData({ ...formData, TipoTrabajo: newInputValue });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tipo de Trabajo"
            margin="normal"
            required
            helperText={tiposTrabajoExistentes.length > 0 ? "Selecciona un tipo existente o escribe uno nuevo" : ""}
          />
        )}
      />

<TextField
        fullWidth
        label="Descripción del Trabajo"
        multiline
        rows={4}
        value={formData.DescripcionTrabajo}
        onChange={(e) => setFormData({ ...formData, DescripcionTrabajo: e.target.value })}
        margin="normal"
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Agregar Mantenimiento'}
      </Button>
    </Box>
  );
};

export default CrearMantenimiento;