import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ActualizarSolicitud from './ActualizarSolicitud';
import ImagenSolicitud from '../Imagenes/solicitudes/ImagenSolicitud';
import {
    Container,
    Typography,
    Box,
    Paper,
    IconButton,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import EditIcon from '@mui/icons-material/Edit';
import { API_URL } from '../../config';
import CustomDialog from '../Common/CustomDialog';
import useFetchData from '../../hooks/useFetchData';
import useDialog from '../../hooks/useDialog';

const DetalleSolicitud = ({ solicitudId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: solicitud, setData: setSolicitud, isLoading } = useFetchData(`${API_URL}/solicitudes/${solicitudId}`);
    const { data: usuarios } = useFetchData(`${API_URL}/usuarios`);

    const { isOpen: isEditDialogOpen, openDialog: openEditDialog, closeDialog: closeEditDialog } = useDialog();
    const { isOpen: isImageDialogOpen, openDialog: openImageDialog, closeDialog: closeImageDialog } = useDialog();

    const handleSolicitudActualizada = (solicitudActualizada) => {
        setSolicitud(solicitudActualizada);
        closeEditDialog();
    };

    const handleOpenEditDialog = () => openEditDialog();
    const handleOpenImageDialog = () => openImageDialog();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!solicitud) {
        return (
            <Container>
                <Typography variant="h6">No se encontró la solicitud</Typography>
            </Container>
        );
    }

    // Asignar el nombre de la unidad y el nombre del usuario
    const unidadNombre = solicitud.Unidad || 'Desconocido';
    const usuarioNombre = usuarios.find(usuario => usuario.IdUsuario === solicitud.IdUsuario)?.NombreCompleto || 'Desconocido';

    return (
        <Container>
             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Solicitud
            </Typography>
            
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    mb: 2, 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid',
                    borderColor: 'grey.300',
                    backgroundColor: 'grey.50',
                    boxShadow: 3,
                }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                            {unidadNombre} - {solicitud.Descripcion}
                        </Typography>
                        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                            Código Solicitud: {solicitud.IdSolicitud}
                        </Typography>
                        <Typography variant="body2" component="div">
                            Estado: {solicitud.Estado}
                        </Typography>
                        <Typography variant="body2" component="div">
                            Fecha de Solicitud: {new Date(solicitud.FechaInicio).toLocaleDateString("es-ES")}
                        </Typography>
                        <Typography variant="body2" component="div">
                            Prioridad: {solicitud.Prioridad}
                        </Typography>
                        <Typography variant="body2" component="div">
                            Tipo de Trabajo: {solicitud.TipoTrabajo}
                        </Typography>
                    </Box>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'row' : 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ml: isMobile ? 0 : 2,
                            mt: isMobile ? 2 : 0,
                            gap: 2, 
                        }}
                    >
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
                                padding: 5,
                                backgroundColor: 'background.paper',
                                textAlign: 'center'
                            }}
                            onClick={handleOpenImageDialog}
                        >
                            <CardContent>
                                <PhotoIcon fontSize={isMobile ? "small" : "medium"} />
                                <Typography variant="body2" color="textSecondary" sx={{ mt: isMobile ? 0 : 1, fontSize: isMobile ? '0.6rem' : '0.75rem' }}>
                                    {isMobile ? 'Carta' : 'Carta Solicitud'}
                                </Typography>
                            </CardContent>
                        </Card>
                        <IconButton onClick={handleOpenEditDialog} color="primary">
                            <EditIcon />
                        </IconButton>
                    </Box>
                </Box>
            

            {/* Diálogo para editar solicitud */}
            <CustomDialog
                open={isEditDialogOpen}
                onClose={closeEditDialog}
                title="Editar Solicitud"
                onSubmit={() => {}}
            >
                <ActualizarSolicitud
                    solicitudId={solicitud.IdSolicitud}
                    onSolicitudActualizada={handleSolicitudActualizada}
                    onClose={closeEditDialog}
                />
            </CustomDialog>

            {/* Diálogo para ver imágenes de solicitud */}
            <CustomDialog
                open={isImageDialogOpen}
                onClose={closeImageDialog}
                title="Imágenes de Solicitud"
                onSubmit={() => {}}
            >
                <ImagenSolicitud solicitudId={solicitud.IdSolicitud} />
            </CustomDialog>
        </Container>
    );
};

export default DetalleSolicitud;
