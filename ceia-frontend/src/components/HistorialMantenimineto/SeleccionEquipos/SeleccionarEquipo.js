// EditarEquipo.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig';
import {
    Typography,
    Button,
    Box,
    FormControl,
    TextField,
    CircularProgress,
    Paper,
    Autocomplete,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { 
    Engineering as EngineeringIcon,
    Build as BuildIcon,
    Save as SaveIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import AgregarEquipo from '../../Equipos/AgregarEquipo';
import { API_URL } from '../../../config';

const EditarEquipo = ({ 
    historialId, 
    onActualizado = () => {}, 
    onClose 
}) => {
    const [historial, setHistorial] = useState({ IdEquipo: null });
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fetchEquipos = async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/equipos`);
            setEquipos(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historialResponse, equiposResponse] = await Promise.all([
                    axiosInstance.get(`${API_URL}/mantenimientos/${historialId}`),
                    axiosInstance.get(`${API_URL}/equipos`)
                ]);
                
                setHistorial({ ...historialResponse.data });
                setEquipos(equiposResponse.data);
                const equipoSeleccionado = equiposResponse.data.find(
                    equipo => equipo.IdEquipo === historialResponse.data.IdEquipo
                );
                setSelectedEquipo(equipoSeleccionado || null);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [historialId]);

    const handleChange = (e, value) => {
        setSelectedEquipo(value);
        setHistorial(prev => ({ ...prev, IdEquipo: value?.IdEquipo || null }));
    };

    const handleSubmit = async () => {
        try {
            const updatedHistorial = { IdEquipo: historial.IdEquipo };
            await axiosInstance.put(`${API_URL}/mantenimientos/${historialId}`, updatedHistorial);
            if (typeof onActualizado === 'function') {
                await onActualizado();
            }
            if (onClose) onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleEquipoAgregado = async () => {
        await fetchEquipos();
        handleCloseModal();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper 
            elevation={3}
            sx={{ 
                p: 3, 
                maxWidth: 500, 
                mx: 'auto',
                borderRadius: 2
            }}
        >
            <Box display="flex" alignItems="center" mb={3}>
                <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                    Seleccionar Equipo
                </Typography>
            </Box>

            <FormControl fullWidth>
                <Autocomplete
                    value={selectedEquipo}
                    onChange={handleChange}
                    options={equipos}
                    getOptionLabel={(option) => option?.Equipo || ''}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Buscar equipo"
                            variant="outlined"
                            error={!!error}
                            helperText={error || "Seleccione el equipo para este mantenimiento"}
                        />
                    )}
                    renderOption={(props, option) => (
                        <MenuItem {...props}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <EngineeringIcon fontSize="small" />
                                    <Typography variant="body1">
                                        {option.Equipo}
                                    </Typography>
                                </Box>
                                {option.Ubicacion && (
                                    <Typography variant="caption" color="text.secondary">
                                        Ubicación: {option.Ubicacion}
                                    </Typography>
                                )}
                            </Box>
                        </MenuItem>
                    )}
                    isOptionEqualToValue={(option, value) => 
                        option?.IdEquipo === value?.IdEquipo
                    }
                />
            </FormControl>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Button 
                    onClick={handleSubmit}  
                    variant="contained" 
                    disabled={!historial.IdEquipo}
                    startIcon={<SaveIcon />}
                >
                    Guardar
                </Button>
                <Box>
                    <Button
                        onClick={handleOpenModal}
                        variant="outlined"
                        sx={{ mr: 1 }}
                    >
                        Agregar Equipo
                    </Button>
                    {onClose && (
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            color="secondary"
                            startIcon={<CloseIcon />}
                        >
                            Cancelar
                        </Button>
                    )}
                </Box>
            </Box>

            <Dialog 
                open={openModal} 
                onClose={handleCloseModal} 
                maxWidth="sm" 
                fullWidth
            >
                <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
                <DialogContent>
                    <AgregarEquipo 
                        onClose={handleCloseModal} 
                        onEquipoAgregado={handleEquipoAgregado}
                    />
                </DialogContent>
            </Dialog>
        </Paper>
    );
};

export default EditarEquipo;