import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ActualizarEquipo from './ActualizarEquipo';
import ImagenEquipo from '../Imagenes/equipos/ImagenEquipo';
import EliminarEquipo from './EliminarEquipo';
import {
    Container,
    Typography,
    Box,
    Paper,
    IconButton,
    CircularProgress,
    Card,
    CardContent,
    Chip,
    Grid,
    Tooltip,
    TextField
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import { API_URL } from '../../config';
import CustomDialog from '../Common/CustomDialog';
import useFetchData from '../../hooks/useFetchData';
import useDialog from '../../hooks/useDialog';

const DetalleEquipo = ({ equipoId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: equipo, setData: setEquipo, isLoading } = useFetchData(`${API_URL}/equipos/${equipoId}`);
    
    const [searchTerm, setSearchTerm] = useState("");  // Estado para almacenar el valor de búsqueda

    const { isOpen: isEditDialogOpen, openDialog: openEditDialog, closeDialog: closeEditDialog } = useDialog();
    const { isOpen: isImageDialogOpen, openDialog: openImageDialog, closeDialog: closeImageDialog } = useDialog();

    const handleEquipoActualizado = (equipoActualizado) => {
        setEquipo(equipoActualizado);
        closeEditDialog(); // Cerrar el diálogo después de actualizar el equipo
    };

    const handleOpenEditDialog = () => openEditDialog('edit');
    const handleOpenImageDialog = () => openImageDialog('image');

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!equipo) {
        return (
            <Container>
                <Typography variant="h6">No se encontró el equipo</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Detalle de Equipo
                    </Typography>
                </Box>
            </Paper>

            <Card sx={{ display: 'flex', flexDirection: 'column', padding: 2, boxShadow: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                                {equipo.Equipo}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                    label={equipo.Estado === 1 ? 'Activo' : 'Inactivo'}
                                    color={equipo.Estado === 1 ? 'success' : 'error'}
                                    size="small"
                                />
                                <Chip
                                    label={`NIA: ${equipo.NIA}`}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        </Box>
                    
                    </Box>

                    <Grid container spacing={2}>
                        {/* Características */}
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <InventoryIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Características
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body2">Registro: {equipo.Registro}</Typography>
                                    <Typography variant="body2">Marca: {equipo.Marca}</Typography>
                                    <Typography variant="body2">Modelo: {equipo.Modelo}</Typography>
                                    <Typography variant="body2">Serie: {equipo.Serie}</Typography>
                                    <Typography variant="body2">Unidad: {equipo.Unidad}</Typography>
                                    <Typography variant="body2">Encargado: {equipo.Encargado}</Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Información adicional */}
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <InventoryIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Información
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body2">Manual Usuario: {equipo.ManualUsuario}</Typography>
                                    <Typography variant="body2">Manual Servicio: {equipo.ManualServicio}</Typography>
                                    <Typography variant="body2">Garantía: {equipo.Garantia}</Typography>
                                    <Typography variant="body2">Procedencia: {equipo.Procedencia}</Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Datos técnicos */}
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <InventoryIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Datos Técnicos
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body2">Tensión: {equipo.Tencion}</Typography>
                                    <Typography variant="body2">Frecuencia: {equipo.Frecuencia}</Typography>
                                    <Typography variant="body2">Corriente: {equipo.Corriente}</Typography>
                                    <Typography variant="body2">Observaciones: {equipo.Observaciones}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Opciones (Eliminar, Editar, Agregar Imagen) */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <EliminarEquipo
                            equipoId={equipo.IdEquipo}
                            onEquipoEliminado={() => setEquipo(null)} // Establece el equipo a null cuando es eliminado
                        />
                        <Tooltip title="Editar">
                            <IconButton
                                size="small"
                                onClick={handleOpenEditDialog}
                                sx={{ backgroundColor: 'action.hover' }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Agregar imágenes">
                            <IconButton
                                size="small"
                                onClick={handleOpenImageDialog}
                                sx={{ backgroundColor: 'action.hover' }}
                            >
                                <PhotoIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardContent>
            </Card>


            {/* Diálogo para editar equipo */}
            <CustomDialog
                open={isEditDialogOpen}
                onClose={closeEditDialog}
                title="Editar Equipo"
                onSubmit={() => {}}
            >
                <ActualizarEquipo
                    equipoId={equipo.IdEquipo}
                    onEquipoActualizado={handleEquipoActualizado}
                    onClose={closeEditDialog} // Asegúrate de pasar el método de cierre aquí
                />
            </CustomDialog>

            {/* Diálogo para ver imágenes de equipo */}
            <CustomDialog
                open={isImageDialogOpen}
                onClose={closeImageDialog}
                title="Imágenes de Equipo"
                onSubmit={() => {}}
            >
                <ImagenEquipo equipoId={equipo.IdEquipo} />
            </CustomDialog>
        </Container>
    );
};

export default DetalleEquipo;
