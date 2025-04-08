import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
} from '@mui/material';
import { API_URL } from '../../config';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ActualizarSolicitud = ({ solicitudId, onSolicitudActualizada }) => {
    const [solicitud, setSolicitud] = useState({
        IdSolicitud: '',
        Descripcion: '',
        Unidad: '',
        Estado: '',
        FechaInicio: '',
        FechaFin: '',
        Prioridad: '',
        TipoTrabajo: '',
    });
    const [unidades, setUnidades] = useState([]);

    const concluirSolicitud = async () => {
        try {
            const fechaActual = new Date().toISOString().split('T')[0];
            const solicitudActualizada = {
                ...solicitud,
                Estado: 'Concluido',
                FechaFin: fechaActual
            };
            const response = await axiosInstance.put(`${API_URL}/solicitudes/${solicitudId}`, solicitudActualizada);
            console.log('Solicitud concluida:', response.data);
            onSolicitudActualizada(response.data);
            setSolicitud(response.data);
        } catch (error) {
            console.error('Hubo un error al concluir la solicitud:', error);
        }
    };

    useEffect(() => {
        const fetchSolicitud = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/solicitudes/${solicitudId}`);
                setSolicitud(response.data);
            } catch (error) {
                console.error('Hubo un error al obtener la solicitud:', error);
            }
        };

        const fetchUnidades = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/unidades`);
                setUnidades(response.data);
            } catch (error) {
                console.error('Error al obtener la lista de unidades:', error);
            }
        };

        fetchUnidades();
        fetchSolicitud();
    }, [solicitudId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSolicitud((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`${API_URL}/solicitudes/${solicitudId}`, solicitud);
            console.log('Solicitud actualizada:', response.data);
            onSolicitudActualizada(response.data);
        } catch (error) {
            console.error('Hubo un error al actualizar la solicitud:', error);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Actualizar Solicitud
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Unidad"
                        name="Unidad"
                        value={solicitud.Unidad}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                </FormControl>

                <TextField
                    label="Descripción"
                    name="Descripcion"
                    value={solicitud.Descripcion}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />
                
                <FormControl fullWidth margin="normal">
                    <InputLabel>Estado</InputLabel>
                    <Select
                        name="Estado"
                        value={solicitud.Estado || ''}
                        onChange={handleInputChange}
                        required
                    >
                        <MenuItem value="Pendiente">Pendiente</MenuItem>
                        <MenuItem value="En Proceso">En Proceso</MenuItem>
                        <MenuItem value="Concluido">Concluido</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Fecha de Inicio"
                    type="date"
                    name="FechaInicio"
                    value={solicitud.FechaInicio ? solicitud.FechaInicio.split(' ')[0] : ''}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Fecha de Fin"
                    type="date"
                    name="FechaFin"
                    value={solicitud.FechaFin ? solicitud.FechaFin.split(' ')[0] : ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                        name="Prioridad"
                        value={solicitud.Prioridad || ''}
                        onChange={handleInputChange}
                        required
                    >
                        <MenuItem value="Alta">Alta</MenuItem>
                        <MenuItem value="Media">Media</MenuItem>
                        <MenuItem value="Baja">Baja</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Tipo de Trabajo"
                    name="TipoTrabajo"
                    value={solicitud.TipoTrabajo}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary">
                            Actualizar Solicitud
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={concluirSolicitud}
                            disabled={solicitud.Estado === 'Concluido'}
                            sx={{
                                backgroundColor: 'success.main',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'success.dark',
                                }
                            }}
                        >
                            <CheckCircleIcon />
                            Concluir Solicitud
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default ActualizarSolicitud;