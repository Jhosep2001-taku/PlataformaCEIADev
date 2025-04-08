import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DetalleSolicitud from '../solicitudes/DetalleSolicitud';
import DetalleEquipo from '../Equipos/DetalleEquipo';
import EditarHistorialMantenimiento from './ActualizarHistorialMantenimiento';
import EliminarHistorialMantenimiento from './EliminarHistorialMantenimiento';
import EditarEquipo from './SeleccionEquipos/SeleccionarEquipo';
import PersonalAsignado from './Personal/PersonalAsignado';  
import useDialog from '../../hooks/useDialog';
import CustomDialog from '../Common/CustomDialog';
import CrearMantenimiento from './CrearMantenimiento';
import DescriptionIcon from '@mui/icons-material/Description';

const MantenimientoList = ({ 
  groupedMantenimientos, 
  onRefresh, 
  solicitudes 
}) => {
  const navigate = useNavigate(); 
  const [selectedHistorialId, setSelectedHistorialId] = useState(null);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [openCrearDialog, setOpenCrearDialog] = useState(false);

  
  // Hooks para diálogos
  const { 
    isOpen: openEditDialog, 
    openDialog: handleOpenEdit, 
    closeDialog: handleCloseEdit 
  } = useDialog();
  
  const { 
    isOpen: openEditEquipoDialog, 
    openDialog: handleOpenEditEquipo, 
    closeDialog: handleCloseEditEquipo 
  } = useDialog();

  // Manejadores de diálogos
  const handleOpenCrear = (solicitudId, e) => {
    e.stopPropagation();
    setSelectedSolicitudId(solicitudId);
    setOpenCrearDialog(true);
  };
  
  const handleCloseCrear = () => {
    setOpenCrearDialog(false);
    setSelectedSolicitudId(null);
  };

  // Manejador de actualización de historial
  const handleHistorialActualizado = async () => {
    await onRefresh();
    handleCloseEdit();
    handleCloseEditEquipo();
  };

  // Función para formatear fecha
  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    return isNaN(date) 
      ? 'Fecha no válida' 
      : new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString();
  };

  // Renderización de mantenimiento individual
  const renderMantenimiento = (mantenimiento, estadoSolicitudes) => (
    <Grid item xs={12} key={mantenimiento.IdHistorial || 'undefined-key'}>
      <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
        <Typography variant="subtitle1">
          Fecha: {formattedDate(mantenimiento.FechaMantenimiento)}
        </Typography>
        <Typography>
          Tipo de trabajo: {mantenimiento.TipoTrabajo || 'Sin descripción'}
        </Typography>
        <Typography>
          Descripción del trabajo: {mantenimiento.DescripcionTrabajo || 'Sin descripción'}
        </Typography>
        <Chip
          label={estadoSolicitudes[mantenimiento.IdSolicitud] || 'Estado no definido'}
          color={
            estadoSolicitudes[mantenimiento.IdSolicitud] === 'Completado'
              ? 'success'
              : estadoSolicitudes[mantenimiento.IdSolicitud] === 'Pendiente'
              ? 'warning'
              : 'default'
          }
          sx={{ mt: 1 }}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedHistorialId(mantenimiento.IdHistorial);
                handleOpenEdit();
              }}
              color="primary"
              sx={{ mr: 1 }}
            >
              Editar Historial
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedHistorialId(mantenimiento.IdHistorial);  
                handleOpenEditEquipo();
              }}
              color="primary" 
            >
              Seleccionar Equipo
            </Button>
          </Box>
          
          <Box sx={{ ml: 2 }}>
            <EliminarHistorialMantenimiento
              historialId={mantenimiento.IdHistorial}
              onHistorialEliminado={onRefresh}  
            />
          </Box>
        </Box>

        {mantenimiento.IdEquipo && <DetalleEquipo equipoId={mantenimiento.IdEquipo} />}
      </Box>
    </Grid>
  );

  // Si no hay mantenimientos
  if (!groupedMantenimientos || Object.keys(groupedMantenimientos).length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No hay mantenimientos disponibles</Typography>
      </Box>
    );
  }

  // Mapeo de estados de solicitudes
  const estadoSolicitudes = solicitudes.reduce((acc, solicitud) => {
    acc[solicitud.IdSolicitud] = solicitud.Estado;
    return acc;
  }, {});

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', paddingBottom: '64px' }}>
      <Box>
        {Object.entries(groupedMantenimientos).map(([IdSolicitud, mantenimientos]) => {
          if (!mantenimientos || !mantenimientos[0]) return null;

          const equipoNombre = mantenimientos[0]?.equipo?.nombre;
          const estadoSolicitud = estadoSolicitudes[IdSolicitud] || 'Estado no definido';

          return (
            <Accordion key={IdSolicitud}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    flexDirection: 'column'
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Solicitud N°{IdSolicitud} - {estadoSolicitud} 
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate(`/informes/${IdSolicitud}`); 
                    }}
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    <DescriptionIcon sx={{ mr: 1 }} />
                    Generar Informe
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => handleOpenCrear(IdSolicitud, e)}
                  >
                    Agregar Mantenimiento
                  </Button>
                </Box>
                <PersonalAsignado IdSolicitud={parseInt(IdSolicitud)} />
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {mantenimientos.map(mantenimiento => renderMantenimiento(mantenimiento, estadoSolicitudes))}
                </Grid>
                <DetalleSolicitud solicitudId={IdSolicitud} />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Diálogos */}
      <CustomDialog 
        title="Actualizar Historial" 
        open={openEditDialog} 
        onClose={handleCloseEdit}
      >
        <EditarHistorialMantenimiento 
          historialId={selectedHistorialId} 
          onHistorialActualizado={handleHistorialActualizado} 
        />
      </CustomDialog>

      <CustomDialog 
        title="Seleccionar equipo" 
        open={openEditEquipoDialog} 
        onClose={handleCloseEditEquipo}
      >
        <EditarEquipo 
          historialId={selectedHistorialId} 
          onActualizado={handleHistorialActualizado}   
        />
      </CustomDialog>

      <CustomDialog 
        title={`Agregar Mantenimiento en #${selectedSolicitudId}`} 
        open={openCrearDialog} 
        onClose={handleCloseCrear}
      >
        <CrearMantenimiento
          solicitudId={selectedSolicitudId}
          onMantenimientoCreado={() => {
            onRefresh();
            handleCloseCrear();
          }}
        />
      </CustomDialog>
    </Box>
  );
};

export default MantenimientoList;
