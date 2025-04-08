import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Typography, Divider, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import useFetchData from '../../../hooks/useFetchData';
import { API_URL } from '../../../config';

const PersonalAsignado = ({ IdSolicitud }) => {
  // Obtener datos de personal asignado y usuarios
  const { data: personalData, isLoading: isLoadingPersonal, error: fetchError } = useFetchData(`${API_URL}/solicitudPersonal`);
  const { data: usuariosData, isLoading: isLoadingUsuarios } = useFetchData(`${API_URL}/usuarios`);

  const [personalAsignado, setPersonalAsignado] = useState({});

  useEffect(() => {
    if (personalData && usuariosData) {
      // Organizar los datos de personal asignado por solicitud
      const personalPorSolicitud = personalData.reduce((acc, item) => {
        if (!acc[item.IdSolicitud]) {
          acc[item.IdSolicitud] = [];
        }
        acc[item.IdSolicitud].push(item.IdUsuario);
        return acc;
      }, {});

      setPersonalAsignado(personalPorSolicitud);
    }
  }, [personalData, usuariosData]);

  if (isLoadingPersonal || isLoadingUsuarios) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Cargando datos...
        </Typography>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Typography variant="body2" color="error" sx={{ p: 2 }}>
        Error al cargar los datos: {fetchError}
      </Typography>
    );
  }

  const personalIds = personalAsignado[IdSolicitud] || [];

  if (personalIds.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        No hay personal asignado
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="subtitle2" sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
        Personal Asignado:
      </Typography>
      <List dense>
        {personalIds.map((userId, index) => {
          const usuario = usuariosData.find((usuario) => usuario.IdUsuario === userId);
          if (!usuario) {
            return (
              <ListItem key={userId}>
                <ListItemText primary="Usuario no encontrado" />
              </ListItem>
            );
          }

          return (
            <React.Fragment key={userId}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={usuario.NombreCompleto}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon sx={{ fontSize: 'small' }} />
                      <Typography variant="body2">{usuario.Rol || 'Rol no especificado'}</Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < personalIds.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default PersonalAsignado;
