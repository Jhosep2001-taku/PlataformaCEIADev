import React, { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CrearSolicitud from './CrearSolicitud';
import ActualizarSolicitud from './ActualizarSolicitud';
import EliminarSolicitud from './EliminarSolicitud';
import ImagenSolicitud from '../Imagenes/solicitudes/ImagenSolicitud';
import AsociarUsuarios from './AsociarUsuarios';
import useFetchData from '../../hooks/useFetchData';
import useDialog from '../../hooks/useDialog';
import CustomDialog from '../Common/CustomDialog';
import axiosInstance from '../../axiosConfig';
import {
    Container, Typography, Button, Box, Paper, IconButton,
    CircularProgress, TextField, InputAdornment, List, ListItem,
    MenuItem, Select, FormControl, InputLabel, Card, CardContent
} from '@mui/material';
import { 
    PhotoCamera as PhotoIcon, 
    Add as AddIcon, 
    Edit as EditIcon, 
    Search as SearchIcon,
    GroupAdd as GroupAddIcon
} from '@mui/icons-material';

import { API_URL } from '../../config';
import { decrypt } from '../../utils/crypto';

const Solicitudes = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { IdUsuario: idUsuario, TipoPermiso: tipoPermiso } = useMemo(() => {
        try {
            const encryptedUserData = localStorage.getItem('userData');
            if (!encryptedUserData) throw new Error('User data not available');
            const userData = decrypt(encryptedUserData);
            if (!userData.IdUsuario || !userData.TipoPermiso) throw new Error('Incomplete user data');
            return userData;
        } catch (error) {
            console.error('Error obtaining user data:', error);
            return { IdUsuario: null, TipoPermiso: [] };
        }
    }, []);

    const isAdmin = tipoPermiso.includes('Administrador del Sistema');

    const { data: solicitudes, isLoading: loadingSolicitudes, setData: setSolicitudes } = useFetchData(`${API_URL}/solicitudes`);

    const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
    const [filters, setFilters] = useState({
        estado: '',
        prioridad: '',
        unidad: '',
        descripcion: '',
        startDate: '',
        endDate: ''
    });

    const { isOpen: openCreateDialog, openDialog: openCreateDialogHandler, closeDialog: closeCreateDialogHandler } = useDialog();
    const { isOpen: openEditDialog, openDialog: openEditDialogHandler, closeDialog: closeEditDialogHandler } = useDialog();
    const { isOpen: openImageDialog, openDialog: openImageDialogHandler, closeDialog: closeImageDialogHandler } = useDialog();
    const [openAsociarUsuarios, setOpenAsociarUsuarios] = useState(false);

    const estados = useMemo(() => [...new Set(solicitudes.map(s => s.Estado))], [solicitudes]);

    const filteredSolicitudes = useMemo(() => {
        return solicitudes.filter(solicitud => {
            const unidadMatch = solicitud.Unidad.toLowerCase().includes(filters.unidad.toLowerCase());
            const descripcionMatch = solicitud.Descripcion.toLowerCase().includes(filters.descripcion.toLowerCase());
            const estadoMatch = !filters.estado || solicitud.Estado === filters.estado;
            const prioridadMatch = !filters.prioridad || solicitud.Prioridad === filters.prioridad;
            const usuarioMatch = isAdmin || solicitud.IdUsuario === idUsuario;
            
            const solicitudDate = new Date(solicitud.FechaInicio);
            const startDateObj = filters.startDate ? new Date(filters.startDate) : null;
            const endDateObj = filters.endDate ? new Date(filters.endDate) : null;
            
            const dateMatch = (!startDateObj || solicitudDate >= startDateObj) && 
                              (!endDateObj || solicitudDate <= endDateObj);
            
            return unidadMatch && descripcionMatch && estadoMatch && prioridadMatch && usuarioMatch && dateMatch;
        });
    }, [solicitudes, filters, isAdmin, idUsuario]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSolicitudAgregada = async (nuevaSolicitud) => {
        try {
            // Primero agregamos la solicitud al estado usando setSolicitudes del hook
            setSolicitudes(prev => [...prev, nuevaSolicitud]);
    
            // Preparamos los datos del mantenimiento
            const mantenimientoData = {
                FechaMantenimiento: nuevaSolicitud.FechaInicio,
                DescripcionTrabajo: nuevaSolicitud.Descripcion,
                TipoTrabajo: nuevaSolicitud.TipoTrabajo,
                IdEquipo: nuevaSolicitud.IdEquipo || null,
                IdSolicitud: nuevaSolicitud.IdSolicitud
            };
    
            // Usamos axiosInstance en lugar de fetch
            const response = await axiosInstance.post('/mantenimientos', mantenimientoData);
    
            console.log('Mantenimiento creado:', response.data);
            closeCreateDialogHandler();
    
        } catch (error) {
            console.error('Error al crear el mantenimiento:', error);
            // Aquí podrías agregar un manejo de errores más específico
            if (error.response) {
                // Error de respuesta del servidor
                console.error('Error del servidor:', error.response.data);
            } else if (error.request) {
                // Error de no respuesta
                console.error('No hubo respuesta del servidor');
            } else {
                // Error en la configuración de la petición
                console.error('Error en la configuración:', error.message);
            }
        }
    };

    const handleSolicitudActualizada = (solicitudActualizada) => {
        setSolicitudes(prev =>
            prev.map(solicitud =>
                solicitud.IdSolicitud === solicitudActualizada.IdSolicitud ? solicitudActualizada : solicitud
            )
        );
        setSelectedSolicitudId(null);
        closeEditDialogHandler();
    };

    const handleToggleAsociarUsuarios = () => {
        setOpenAsociarUsuarios(!openAsociarUsuarios);
    };

    const handleUsuariosAsociados = (usuariosAsociados) => {
        console.log('Usuarios asociados:', usuariosAsociados);
        
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Gestión de Solicitudes
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={openCreateDialogHandler}
                            startIcon={<AddIcon />}
                            sx={{ borderRadius: '20px' }}
                        >
                            Agregar Solicitud
                        </Button>
                    </Box>

                    {isAdmin && (
                        <>
                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                <TextField
                                    placeholder="Buscar por descripción..."
                                    variant="outlined"
                                    size="small"
                                    value={filters.descripcion}
                                    onChange={(e) => handleFilterChange('descripcion', e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    placeholder="Buscar por unidad..."
                                    variant="outlined"
                                    size="small"
                                    value={filters.unidad}
                                    onChange={(e) => handleFilterChange('unidad', e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormControl variant="outlined" size="small" sx={{ minWidth: '110px' }}>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        value={filters.estado}
                                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                                        label="Estado"
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {estados.map(estado => (
                                            <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" size="small" sx={{ minWidth: '110px' }}>
                                    <InputLabel>Prioridad</InputLabel>
                                    <Select
                                        value={filters.prioridad}
                                        onChange={(e) => handleFilterChange('prioridad', e.target.value)}
                                        label="Prioridad"
                                    >
                                        <MenuItem value="">Todas</MenuItem>
                                        <MenuItem value="Alta">Alta</MenuItem>
                                        <MenuItem value="Media">Media</MenuItem>
                                        <MenuItem value="Baja">Baja</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Fecha Inicio"
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    size="small"
                                />
                                <TextField
                                    label="Fecha Fin"
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <List>
                    {filteredSolicitudes.map((solicitud) => (
                        <ListItem
                            key={solicitud.IdSolicitud}
                            sx={{
                                mb: 2,
                                border: '1px solid',
                                borderColor: solicitud.Estado === 'Pendiente' ? 'warning.main' :
                                             solicitud.Estado === 'Concluido' ? 'success.main' : 'grey.300',
                                p: 2,
                                backgroundColor: 'background.paper',
                                boxShadow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                '&:hover': { backgroundColor: 'grey.100' }
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                                    {solicitud.Unidad} - {solicitud.Descripcion}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Codigo Solicitud: {solicitud.IdSolicitud}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Estado: {solicitud.Estado}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Fecha de Inicio: {new Date(solicitud.FechaInicio).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Fecha de Fin: {new Date(solicitud.FechaFin).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Prioridad: {solicitud.Prioridad}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Tipo de Trabajo: {solicitud.TipoTrabajo}
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ml: isMobile ? 0 : 2,
                                mt: isMobile ? 2 : 0,
                                gap: isMobile ? 1 : 0, 
                            }}>
                                <Card
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: 1,
                                        mr: 2
                                    }}
                                    onClick={() => {
                                        setSelectedSolicitudId(solicitud.IdSolicitud);
                                        openImageDialogHandler();
                                    }}
                                >
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <PhotoIcon fontSize={isMobile ? "small" : "medium"} />
                                    <Typography 
                                        variant="body2" 
                                        color="textSecondary" 
                                        sx={{ mt: isMobile ? 0 : 1, fontSize: isMobile ? '0.6rem' : '0.75rem', textAlign: 'center' }}
                                    >
                                        {isMobile ? 'Carta' : 'Carta Solicitud'}
                                    </Typography>
                                </CardContent>
                                </Card>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: isMobile ? 'row' : 'column',
                                    ml: isMobile ? 2 : 0,
                                    mt: isMobile ? 0 : 2,
                                }}>
                                    
                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            setSelectedSolicitudId(solicitud.IdSolicitud);
                                            handleToggleAsociarUsuarios();
                                        }}
                                        sx={{
                                            borderRadius: '4px',
                                            padding: '8px',
                                            '&:hover': {
                                                color: 'primary'
                                            }
                                        }}
                                    >
                                        <GroupAddIcon />
                                    </IconButton>

                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            setSelectedSolicitudId(solicitud.IdSolicitud);
                                            openEditDialogHandler();
                                        }}
                                        sx={{
                                            borderRadius: '4px', 
                                            padding: '8px',       
                                            '&:hover': {
                                                color: 'primary'  
                                            }
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    <EliminarSolicitud
                                        solicitudId={solicitud.IdSolicitud}
                                        onSolicitudEliminada={() => {
                                            setSolicitudes(prev => prev.filter(s => s.IdSolicitud !== solicitud.IdSolicitud));
                                        }}
                                    />

                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>

                {loadingSolicitudes && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Paper>

            <CustomDialog
                open={openCreateDialog}
                onClose={closeCreateDialogHandler}
                title="Agregar Solicitud"
            >
                <CrearSolicitud onSolicitudAgregada={handleSolicitudAgregada} />
            </CustomDialog>

            <CustomDialog
                open={openEditDialog}
                onClose={closeEditDialogHandler}
                title="Actualizar Solicitud"
            >
                {selectedSolicitudId && (
                    <ActualizarSolicitud
                        solicitudId={selectedSolicitudId}
                        onSolicitudActualizada={handleSolicitudActualizada}
                    />
                )}
            </CustomDialog>

            <CustomDialog
                open={openImageDialog}
                onClose={closeImageDialogHandler}
                title="Imágenes de Solicitud"
            >
                {selectedSolicitudId && <ImagenSolicitud solicitudId={selectedSolicitudId} />}
            </CustomDialog>

            <AsociarUsuarios
                solicitudId={selectedSolicitudId}
                open={openAsociarUsuarios}
                onClose={handleToggleAsociarUsuarios}
                onUsuariosAsociados={handleUsuariosAsociados}
            />
        </Container>
    );
};

export default Solicitudes;