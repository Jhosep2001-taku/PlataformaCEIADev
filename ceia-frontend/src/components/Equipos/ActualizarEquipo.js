import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Switch,
    FormHelperText,
    Select,
    MenuItem,
    Divider
} from '@mui/material';

import { API_URL } from '../../config';

const ActualizarEquipo = ({ equipoId, onEquipoActualizado }) => {
    const [equipo, setEquipo] = useState({
        Equipo: '',
        Registro: '',
        Marca: '',
        Modelo: '',
        Serie: '',
        NIA: '',
        Unidad: '',
        Estado: 1,
        Encargado: '',
        ManualUsuario: '',
        ManualServicio: '',
        Garantia: '',
        Procedencia: '',
        Tencion: '',
        Frecuencia: '',
        Corriente: '',
        Observaciones: '',
    });

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/equipos/${equipoId}`);
                setEquipo(response.data);
            } catch (error) {
                console.error('Hubo un error al obtener el equipo:', error);
            }
        };

        if (equipoId) {
            fetchEquipo();
        }
        
    }, [equipoId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEquipo({ ...equipo, [name]: value });
    };

    const handleEstadoChange = () => {
        const newEstado = equipo.Estado === 1 ? 0 : 1;
        setEquipo({ ...equipo, Estado: newEstado });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.put(`${API_URL}/equipos/${equipoId}`, equipo)
            .then(response => {
                onEquipoActualizado(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al actualizar el equipo:', error);
            });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Actualizar Equipo</Typography>
            <form onSubmit={handleSubmit}>

                {/* Sección 1: Información básica */}
                <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Características</Typography>
                <TextField
                    label="Nombre de Equipo"
                    type="text"
                    name="Equipo"
                    value={equipo.Equipo}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Registro"
                    type="text"
                    name="Registro"
                    value={equipo.Registro}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Marca"
                    type="text"
                    name="Marca"
                    value={equipo.Marca}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Modelo"
                    type="text"
                    name="Modelo"
                    value={equipo.Modelo}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Serie"
                    type="text"
                    name="Serie"
                    value={equipo.Serie}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="NIA"
                    type="text"
                    name="NIA"
                    value={equipo.NIA}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Unidad"
                    type="text"
                    name="Unidad"
                    value={equipo.Unidad}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Encargado"
                    type="text"
                    name="Encargado"
                    value={equipo.Encargado}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <Divider sx={{ my: 4 }} />

                {/* Sección 2: Información adicional */}
                <Typography variant="h6" gutterBottom>Información adicional</Typography>
                <TextField
                    label="Manual de Usuario"
                    type="text"
                    name="ManualUsuario"
                    value={equipo.ManualUsuario}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Manual de Servicio"
                    type="text"
                    name="ManualServicio"
                    value={equipo.ManualServicio}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Garantía"
                    type="text"
                    name="Garantia"
                    value={equipo.Garantia}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Procedencia"
                    type="text"
                    name="Procedencia"
                    value={equipo.Procedencia}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <Divider sx={{ my: 4 }} />

                {/* Sección 3: Datos técnicos */}
                <Typography variant="h6" gutterBottom>Datos Técnicos</Typography>
                <TextField
                    label="Tensión"
                    type="text"
                    name="Tencion"
                    value={equipo.Tencion}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Frecuencia"
                    type="text"
                    name="Frecuencia"
                    value={equipo.Frecuencia}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Corriente"
                    type="text"
                    name="Corriente"
                    value={equipo.Corriente}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <Divider sx={{ my: 4 }} />

                {/* Sección 4: Observaciones y Estado */}
                <Typography variant="h6" gutterBottom>Observaciones y Estado</Typography>
                <TextField
                    label="Observaciones"
                    type="text"
                    name="Observaciones"
                    value={equipo.Observaciones}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Estado" shrink={true}>
                        Estado
                    </InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Switch
                            id="Estado"
                            checked={equipo.Estado === 1}
                            onChange={handleEstadoChange}
                        />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                            {equipo.Estado === 1 ? 'Activo' : 'Baja'}
                        </Typography>
                    </Box>
                    <FormHelperText>Selecciona el estado del Equipo</FormHelperText>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Actualizar Equipo
                </Button>
            </form>
        </Box>
    );
};

export default ActualizarEquipo;
