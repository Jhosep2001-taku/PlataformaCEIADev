import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../config';

const EliminarUnidad = ({ unidadId, onUnidadEliminada, onClose }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const handleDelete = async () => {
        setIsLoading(true);
        setError(null); // Clear previous errors
        try {
            await axiosInstance.delete(`${API_URL}/unidades/${unidadId}`);
            onUnidadEliminada(unidadId);
            handleClose();
        } catch (error) {
            setError('No se puede eliminar esta unidad');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleClickOpen}
                startIcon={<DeleteIcon />}
            >
                Eliminar
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Eliminar Unidad</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar esta unidad? Esta acción no se puede deshacer.
                    </DialogContentText>
                    {error && (
                        <DialogContentText color="error">
                            {error}
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="secondary" disabled={isLoading}>
                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EliminarUnidad;
