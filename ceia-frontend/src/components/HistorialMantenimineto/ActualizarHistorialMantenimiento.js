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
    FormHelperText,
    CircularProgress
} from '@mui/material';
import { API_URL } from '../../config';

const EditarHistorialMantenimiento = ({ historialId, onHistorialActualizado }) => {
    const [historial, setHistorial] = useState({
        FechaMantenimiento: '',
        DescripcionTrabajo: '',
        TipoTrabajo: '',
        IdEquipo: '',
    });
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/mantenimientos/${historialId}`);
                setHistorial(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHistorial();
    }, [historialId]);

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/equipos`);
                setEquipos(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchEquipos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHistorial({
            ...historial,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.put(`${API_URL}/mantenimientos/${historialId}`, historial);
            if (response.status === 200) {
                onHistorialActualizado(); // Asegúrate de que esta función esté correctamente llamada
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <Typography color="error" variant="body1">{error}</Typography>;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Actualizar Historial</Typography>
            <TextField
                label="Fecha de Mantenimiento"
                name="FechaMantenimiento"
                type="date"
                value={historial.FechaMantenimiento}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Equipo</InputLabel>
                <Select
                    name="IdEquipo"
                    value={historial.IdEquipo}
                    onChange={handleChange}
                >
                    {equipos.map((equipo) => (
                        <MenuItem key={equipo.IdEquipo} value={equipo.IdEquipo}>
                            {equipo.Equipo}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>Seleccione el equipo asociado</FormHelperText>
            </FormControl>
             <TextField
                label="Tipo de Trabajo"
                name="TipoTrabajo"
                value={historial.TipoTrabajo}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Descripción del Trabajo"
                name="DescripcionTrabajo"
                value={historial.DescripcionTrabajo}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
            />
           
            <Box sx={{ mt: 2 }}>
                <Button onClick={handleSubmit} variant="contained" color="primary">Actualizar</Button>
            </Box>
        </Box>
    );
};

export default EditarHistorialMantenimiento;
