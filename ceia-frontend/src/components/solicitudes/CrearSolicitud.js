import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { decrypt } from '../../utils/crypto';
import {
    Button,
    TextField,
    FormControl,
    FormHelperText,
    Grid,
    CircularProgress,
    Box,
    Typography,
    MenuItem,
} from '@mui/material';
import { API_URL } from '../../config';

const CrearSolicitud = ({ onSolicitudAgregada }) => {
    const obtenerIdUsuario = () => {
        try {
            const encryptedUserData = localStorage.getItem('userData');
            if (!encryptedUserData) {
                throw new Error('User data is not available in localStorage');
            }
            const userData = decrypt(encryptedUserData);
            if (!userData.IdUsuario) {
                throw new Error('User ID is not available in decrypted user data');
            }
            return userData.IdUsuario;
        } catch (error) {
            console.error('Error al obtener el ID del usuario:', error);
            return null;
        }
    };

    const initialSolicitudState = {
        Descripcion: '',
        Estado: 'Pendiente', 
        FechaInicio: new Date().toISOString().split('T')[0], 
        FechaFin: '', 
        Prioridad: '',
        TipoTrabajo: '',
        Unidad: '', 
        IdUsuario: obtenerIdUsuario(), 
    };

    const [solicitud, setSolicitud] = useState(initialSolicitudState);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(''); 
        setMessageColor('');

        const solicitudData = {
            ...solicitud, 
            IdUsuario: solicitud.IdUsuario, 
            FechaFin: solicitud.FechaFin || null, 
        };

        try {
            const response = await axiosInstance.post(`${API_URL}/solicitudes`, solicitudData);
            onSolicitudAgregada(response.data);
            resetForm();
            setMessage('¡Solicitud creada exitosamente! 🎉');
            setMessageColor('success');  // Cambia el color a verde para mensajes de éxito
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al crear la solicitud. Por favor, inténtelo de nuevo.';
            setMessage(errorMessage);
            setMessageColor('error');  // Cambia el color a rojo para mensajes de error
            console.error('Hubo un error al crear la solicitud:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setSolicitud(initialSolicitudState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSolicitud(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Agregar Solicitud</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="Descripcion"
                                name="Descripcion"
                                label="Descripción"
                                value={solicitud.Descripcion}
                                onChange={handleInputChange}
                                required
                            />
                            <FormHelperText>Ingrese la descripción de la solicitud</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="Prioridad"
                                name="Prioridad"
                                label="Prioridad"
                                select
                                value={solicitud.Prioridad}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="">Seleccione una prioridad</MenuItem>
                                <MenuItem value="Alta">Alta</MenuItem>
                                <MenuItem value="Media">Media</MenuItem>
                                <MenuItem value="Baja">Baja</MenuItem>
                            </TextField>
                            <FormHelperText>Seleccione la prioridad de la solicitud</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="Unidad"
                                name="Unidad"
                                label="Unidad"
                                value={solicitud.Unidad}
                                onChange={handleInputChange}
                                required
                            />
                            <FormHelperText>Ingrese la unidad para la solicitud</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="TipoTrabajo"
                                name="TipoTrabajo"
                                label="Tipo de Trabajo"
                                value={solicitud.TipoTrabajo}
                                onChange={handleInputChange}
                                required
                            />
                            <FormHelperText>Ingrese el tipo de trabajo para la solicitud</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="FechaInicio"
                            name="FechaInicio"
                            label="Fecha Inicio"
                            type="date"
                            value={solicitud.FechaInicio}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="FechaFin"
                            name="FechaFin"
                            label="Fecha Fin"
                            type="date"
                            value={solicitud.FechaFin}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            {isLoading ? <CircularProgress size={24} /> : 'Agregar Solicitud'}
                        </Button>
                    </Grid>
                </Grid>
                {message && (
                    <Typography color={messageColor} sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </form>
        </Box>
    );
};

export default CrearSolicitud;
