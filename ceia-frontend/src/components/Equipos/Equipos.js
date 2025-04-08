import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AgregarEquipo from './AgregarEquipo';
import ActualizarEquipo from './ActualizarEquipo';
import ImagenEquipo from '../Imagenes/equipos/ImagenEquipo';
import EliminarEquipo from './EliminarEquipo';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    IconButton,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    Tooltip,
    TextField
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import { API_URL } from '../../config';
import CustomDialog from '../Common/CustomDialog';
import useFetchData from '../../hooks/useFetchData';
import useDialog from '../../hooks/useDialog';

const Equipos = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: equipos, setData: setEquipos, isLoading } = useFetchData(`${API_URL}/equipos`);
    const [filteredEquipos, setFilteredEquipos] = useState(equipos);  // Estado para los equipos filtrados
    const [searchTerm, setSearchTerm] = useState("");  // Estado para almacenar el valor de búsqueda
    const [selectedEquipoId, setSelectedEquipoId] = useState(null);

    const { isOpen: isCreateDialogOpen, openDialog: openCreateDialog, closeDialog: closeCreateDialog } = useDialog();
    const { isOpen: isEditDialogOpen, openDialog: openEditDialog, closeDialog: closeEditDialog } = useDialog();
    const { isOpen: isImageDialogOpen, openDialog: openImageDialog, closeDialog: closeImageDialog } = useDialog();

    useEffect(() => {
        // Filtrar los equipos en función del término de búsqueda
        const filtered = equipos.filter((equipo) => {
            return (
                equipo.Equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Filtro por nombre del equipo
                equipo.NIA.toLowerCase().includes(searchTerm.toLowerCase())        // Filtro por NIA
            );
        });
        setFilteredEquipos(filtered);
    }, [searchTerm, equipos]);

    const handleEquipoAgregado = (nuevoEquipo) => {
        setEquipos([...equipos, nuevoEquipo]);
        closeCreateDialog();
    };

    const handleEquipoActualizado = (equipoActualizado) => {
        setEquipos(equipos.map(equipo =>
            equipo.IdEquipo === equipoActualizado.IdEquipo ? equipoActualizado : equipo
        ));
        setSelectedEquipoId(null);
        closeEditDialog();
    };

    const handleEquipoEliminado = (equipoId) => {
        setEquipos(equipos.filter(equipo => equipo.IdEquipo !== equipoId));
        setSelectedEquipoId(null);
    };

    const handleOpenCreateDialog = () => openCreateDialog();
    const handleOpenEditDialog = (equipoId) => {
        setSelectedEquipoId(equipoId);
        openEditDialog();
    };
    const handleOpenImageDialog = (equipoId) => {
        setSelectedEquipoId(equipoId);
        openImageDialog();
    };

    const renderSpecification = (label, value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 120 }}>
                {label}:
            </Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
                {value || '-'}
            </Typography>
        </Box>
    );

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Gestión de Equipos
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleOpenCreateDialog} 
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: '20px' }}
                    >
                        Agregar Equipo
                    </Button>
                </Box>
                <TextField
                    label="Buscar por nombre o NIA"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mt: 2 }}
                />
            </Paper>

            <Grid container spacing={3}>
                {filteredEquipos.map((equipo) => (
                    <Grid item xs={12} md={6} lg={4} key={equipo.IdEquipo}>
                        <Card 
                            elevation={2}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6,
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
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
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Ver imágenes">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleOpenImageDialog(equipo.IdEquipo)}
                                                sx={{ backgroundColor: 'action.hover' }}
                                            >
                                                <PhotoIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleOpenEditDialog(equipo.IdEquipo)}
                                                sx={{ backgroundColor: 'action.hover' }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <EliminarEquipo 
                                            equipoId={equipo.IdEquipo} 
                                            onEquipoEliminado={handleEquipoEliminado}
                                        />
                                    </Box>
                                </Box>

                                {/* Características */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <InventoryIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Características
                                    </Typography>
                                    {renderSpecification('Registro', equipo.Registro)}
                                    {renderSpecification('Marca', equipo.Marca)}
                                    {renderSpecification('Modelo', equipo.Modelo)}
                                    {renderSpecification('Serie', equipo.Serie)}
                                    {renderSpecification('Unidad', equipo.Unidad)}
                                    {renderSpecification('Encargado', equipo.Encargado)}
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Información */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Información
                                    </Typography>
                                    {renderSpecification('Manual Usuario', equipo.ManualUsuario)}
                                    {renderSpecification('Manual Servicio', equipo.ManualServicio)}
                                    {renderSpecification('Garantía', equipo.Garantia)}
                                    {renderSpecification('Procedencia', equipo.Procedencia)}
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Datos Técnicos */}
                                <Box>
                                    <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <BuildIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Datos Técnicos
                                    </Typography>
                                    {renderSpecification('Tensión', equipo.Tencion)}
                                    {renderSpecification('Frecuencia', equipo.Frecuencia)}
                                    {renderSpecification('Corriente', equipo.Corriente)}
                                    {renderSpecification('Observaciones', equipo.Observaciones)}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Diálogos */}
            <CustomDialog
                open={isCreateDialogOpen}
                onClose={closeCreateDialog}
                title="Agregar Equipo"
                onSubmit={() => {}}
            >
                <AgregarEquipo onEquipoAgregado={handleEquipoAgregado} />
            </CustomDialog>

            <CustomDialog
                open={isEditDialogOpen}
                onClose={closeEditDialog}
                title="Editar Equipo"
                onSubmit={() => {}}
            >
                <ActualizarEquipo
                    equipoId={selectedEquipoId}
                    onEquipoActualizado={handleEquipoActualizado}
                    onClose={closeEditDialog}
                />
            </CustomDialog>

            <CustomDialog
                open={isImageDialogOpen}
                onClose={closeImageDialog}
                title="Imágenes de Equipo"
                onSubmit={() => {}}
            >
                <ImagenEquipo equipoId={selectedEquipoId} />
            </CustomDialog>
        </Container>
    );
};

export default Equipos;
