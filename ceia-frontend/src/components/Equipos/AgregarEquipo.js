import React, { useState } from 'react';
import {
    Button,
    TextField,
    FormControl,
    FormHelperText,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Switch,
} from '@mui/material';
import useFetchData from '../../hooks/useFetchData'; // Asegúrate de que la ruta sea correcta
import { API_URL } from '../../config';
import axiosInstance from '../../axiosConfig';

// **Estado inicial**
const initialEquipoState = {
    // Características
    Equipo: '',
    Registro: '',
    Marca: '',
    Modelo: '',
    Serie: '',
    NIA: '',
    Unidad: '',
    Estado: 1,
    Encargado: '',
    // Información
    ManualUsuario: '',
    ManualServicio: '',
    Garantia: '',
    Procedencia: '',
    // Datos Técnicos
    Tencion: '',
    Frecuencia: '',
    Corriente: '',
    Observaciones: '',
};

const AgregarEquipo = ({ onEquipoAgregado }) => {
    const [equipo, setEquipo] = useState(initialEquipoState);
    const [imagenes, setImagenes] = useState([]);
    const [imagenPreview, setImagenPreview] = useState(null);

    const { data: unidades, isLoading } = useFetchData('/unidades'); // Datos de unidades

    // **Funciones de manejo de datos**
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEquipo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = () => {
        setEquipo((prev) => ({ ...prev, Estado: prev.Estado === 1 ? 0 : 1 }));
    };

    const handleImagenSeleccionada = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagenPreview(reader.result);
            reader.readAsDataURL(file);
            setImagenes([file]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(equipo).forEach((key) => formData.append(key, equipo[key]));
        imagenes.forEach((imagen) => formData.append('imagenes[]', imagen));

        try {
            const response = await axiosInstance.post(`${API_URL}/equipos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onEquipoAgregado(response.data);
            resetForm();
        } catch (error) {
            console.error('Hubo un error al agregar el equipo:', error);
        }
    };

    const resetForm = () => {
        setEquipo(initialEquipoState);
        setImagenes([]);
        setImagenPreview(null);
    };

    // **Renderizado de secciones**
    const renderCaracteristicas = () => (
        <>
            {[
                { id: 'Equipo', label: 'Equipo', helper: 'Ingrese el nombre del equipo' },
                { id: 'Registro', label: 'Registro', helper: 'Ingrese el registro del equipo' },
                { id: 'Marca', label: 'Marca', helper: 'Ingrese la marca del equipo' },
                { id: 'Modelo', label: 'Modelo', helper: 'Ingrese el modelo del equipo' },
                { id: 'Serie', label: 'Serie', helper: 'Ingrese la serie del equipo' },
                { id: 'NIA', label: 'NIA', helper: 'Ingrese el NIA del equipo' },
                { id: 'Unidad', label: 'Unidad', helper: 'Seleccione la unidad a la que pertenece el equipo' },
                { id: 'Encargado', label: 'Encargado', helper: 'Ingrese el nombre del encargado del equipo' },
            ].map(({ id, label, helper }) => (
                <FormControl fullWidth margin="normal" key={id}>
                    <TextField
                        id={id}
                        name={id}
                        label={label}
                        value={equipo[id]}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            ))}
        </>
    );

    const renderInformacion = () => (
        <>
            {[
                { id: 'ManualUsuario', label: 'Manual de Usuario', helper: 'Ingrese el enlace al manual de usuario' },
                { id: 'ManualServicio', label: 'Manual de Servicio', helper: 'Ingrese el enlace al manual de servicio' },
                { id: 'Garantia', label: 'Garantía', helper: 'Ingrese los detalles de la garantía' },
                { id: 'Procedencia', label: 'Procedencia', helper: 'Ingrese la procedencia del equipo' },
            ].map(({ id, label, helper }) => (
                <FormControl fullWidth margin="normal" key={id}>
                    <TextField
                        id={id}
                        name={id}
                        label={label}
                        value={equipo[id]}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            ))}
        </>
    );

    const renderDatosTecnicos = () => (
        <>
            {[ 
                { id: 'Tencion', label: 'Tensión', helper: 'Ingrese la tensión del equipo' }, // Mantener Tencion
                { id: 'Frecuencia', label: 'Frecuencia', helper: 'Ingrese la frecuencia del equipo' },
                { id: 'Corriente', label: 'Corriente', helper: 'Ingrese la corriente del equipo' },
            ].map(({ id, label, helper }) => (
                <FormControl fullWidth margin="normal" key={id}>
                    <TextField
                        id={id}
                        name={id}
                        label={label}
                        value={equipo[id]}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            ))}
    
            <FormControl fullWidth margin="normal">
                <TextField
                    id="Observaciones"
                    name="Observaciones"
                    label="Observaciones"
                    value={equipo.Observaciones}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    fullWidth
                />
                <FormHelperText>Ingrese observaciones adicionales (texto extenso)</FormHelperText>
            </FormControl>
        </>
    );

    const renderEstadoSwitch = () => (
        <FormControl fullWidth margin="normal">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Switch
                    id="Estado"
                    checked={equipo.Estado === 1}
                    onChange={handleSwitchChange}
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                    {equipo.Estado === 1 ? 'Activo' : 'Baja'}
                </Typography>
            </Box>
            <FormHelperText>Seleccione el estado del equipo</FormHelperText>
        </FormControl>
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="Agregar Equipo" />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Typography variant="h6">Características</Typography>
                            {renderCaracteristicas()}

                            <Typography variant="h6" sx={{ mt: 3 }}>
                                Información
                            </Typography>
                            {renderInformacion()}

                            <Typography variant="h6" sx={{ mt: 3 }}>
                                Datos Técnicos
                            </Typography>
                            {renderDatosTecnicos()}

                            {renderEstadoSwitch()}

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                disabled={isLoading}
                            >
                                Agregar Equipo
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AgregarEquipo;
