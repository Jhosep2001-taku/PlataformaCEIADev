import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    CircularProgress,
    Divider,
    Typography,
    Snackbar,
    Avatar,
    ListItemAvatar,
    Box,
} from '@mui/material';
import axiosInstance from '../../axiosConfig';
import { API_URL } from '../../config';

const AsociarUsuarios = ({ solicitudId, open, onClose, onUsuariosAsociados }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosAsociados, setUsuariosAsociados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            fetchUsuarios();
            fetchUsuariosAsociados();
        }
    }, [open, solicitudId]);

    const fetchUsuarios = async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/usuarios`);
            setUsuarios(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            setError('Error fetching usuarios. Please try again.');
            setUsuarios([]);
        }
    };

    const fetchUsuariosAsociados = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${API_URL}/solicitudPersonal`);
            const solicitudes = Array.isArray(response.data) ? response.data : [];
            const usuariosAsociadosFiltrados = solicitudes
                .filter(solicitud => solicitud.IdSolicitud === solicitudId)
                .map(solicitud => solicitud.IdUsuario);
            setUsuariosAsociados(usuariosAsociadosFiltrados);
        } catch (error) {
            console.error('Error fetching usuarios asociados:', error);
            setError('Error fetching associated users. Please try again.');
            setUsuariosAsociados([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleUsuario = async (usuario) => {
        try {
            if (usuariosAsociados.includes(usuario.IdUsuario)) {
                // Desasociar usuario
                await axiosInstance.delete(`${API_URL}/solicitudPersonal/${solicitudId}/${usuario.IdUsuario}`);
                setUsuariosAsociados(prev => prev.filter(u => u !== usuario.IdUsuario));
            } else {
                // Asociar usuario
                await axiosInstance.post(`${API_URL}/solicitudPersonal`, {
                    IdSolicitud: solicitudId,
                    IdUsuario: usuario.IdUsuario,
                });
                setUsuariosAsociados(prev => [...prev, usuario.IdUsuario]);
            }
        } catch (error) {
            console.error('Error toggling usuario:', error);
            setError('Error toggling user association. Please try again.');
        }
    };

    const handleGuardar = () => {
        onUsuariosAsociados(usuariosAsociados);
        onClose();
    };

    const handleCloseSnackbar = () => {
        setError(null);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>ASIGNAR PERSONAL</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>Personal Asignado</Typography>
                        {usuariosAsociados.length > 0 ? (
                            <List>
                                {usuariosAsociados.map((idUsuario) => {
                                    const usuario = usuarios.find(u => u.IdUsuario === idUsuario);
                                    return (
                                        <ListItem
                                            key={idUsuario}
                                            dense
                                            button
                                            onClick={() => handleToggleUsuario({ IdUsuario: idUsuario })}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={`path/to/avatar/${idUsuario}.png`} />
                                            </ListItemAvatar>
                                            <Checkbox
                                                edge="start"
                                                checked={true}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                            <ListItemText
                                                primary={usuario?.NombreCompleto}
                                                secondary={`${usuario?.Rol} - ${usuario?.Estado === 1 ? 'Activo' : 'Inactivo'}`}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        ) : (
                            <Typography>No hay personal asignado</Typography>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Personal Disponible</Typography>
                        <List>
                            {usuarios
                                .filter(u => !usuariosAsociados.includes(u.IdUsuario))
                                .map((usuario) => (
                                    <ListItem
                                        key={usuario.IdUsuario}
                                        dense
                                        button
                                        onClick={() => handleToggleUsuario(usuario)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={`path/to/avatar/${usuario.IdUsuario}.png`} />
                                        </ListItemAvatar>
                                        <Checkbox
                                            edge="start"
                                            checked={false}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                        <ListItemText
                                            primary={usuario.NombreCompleto}
                                            secondary={`${usuario.Rol} - ${usuario.Estado === 1 ? 'Activo' : 'Inactivo'}`}
                                        />
                                    </ListItem>
                                ))}
                        </List>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleGuardar} color="primary" variant="contained">
                    Guardar Cambios
                </Button>
            </DialogActions>
            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={error}
            />
        </Dialog>
    );
};

export default AsociarUsuarios;
