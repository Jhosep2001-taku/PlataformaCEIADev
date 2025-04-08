import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Chip,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import { API_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import PersonalAsignado from '../HistorialMantenimineto/Personal/PersonalAsignado';

const DetalleEquipo = lazy(() => import('../Equipos/DetalleEquipo'));
const DetalleSolicitud = lazy(() => import('../solicitudes/DetalleSolicitud'));

const HistorialMantenimientoEquipos = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: equipos, isLoading: isLoadingEquipos } = useFetchData(`${API_URL}/equipos`);
    const { data: mantenimientos, isLoading: isLoadingMantenimientos } = useFetchData(`${API_URL}/mantenimientos`);
    const [equiposConMantenimiento, setEquiposConMantenimiento] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (equipos && mantenimientos) {
            const equiposConHistorial = equipos.map(equipo => ({
                ...equipo,
                mantenimientos: mantenimientos.filter(m => m && m.IdEquipo === equipo.IdEquipo)
            }));
            setEquiposConMantenimiento(equiposConHistorial);
        }
    }, [equipos, mantenimientos]);

    const filteredEquipos = useMemo(() => {
        return equiposConMantenimiento.filter(equipo => 
            equipo.Equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipo.NIA.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [equiposConMantenimiento, searchTerm]);

    if (isLoadingEquipos || isLoadingMantenimientos) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Historial de Mantenimiento de Equipos
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por nombre de equipo o NIA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            {filteredEquipos.map((equipo) => (
                <Accordion key={equipo.IdEquipo} sx={{ 
                    mb: 2, 
                    boxShadow: 3,
                    '&:before': {
                        display: 'none',
                    },
                    '&.Mui-expanded': {
                        margin: theme.spacing(1, 0),
                    },
                }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${equipo.IdEquipo}-content`}
                        id={`panel-${equipo.IdEquipo}-header`}
                        sx={{
                            backgroundColor: theme.palette.grey[100],
                            '&:hover': {
                                backgroundColor: theme.palette.grey[200],
                            },
                        }}
                    >
                        <Typography sx={{ flexGrow: 1 }}>{equipo.Equipo}</Typography>
                        <Chip label={equipo.NIA} color="primary" size="small" sx={{ mr: 1 }} />
                        <Chip 
                            icon={<BuildIcon />} 
                            label={equipo.mantenimientos.length} 
                            color="secondary" 
                            size="small" 
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Suspense fallback={<CircularProgress />}>
                                    <DetalleEquipo equipoId={equipo.IdEquipo} />
                                </Suspense>
                            </Grid>
                            <Grid item xs={12}>
                                <Card sx={{ 
                                    p: 2, 
                                    mb: 2, 
                                    boxShadow: 3, 
                                    borderRadius: 2, 
                                    backgroundColor: theme.palette.background.default 
                                }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                            Historial de Mantenimiento
                                        </Typography>
                                        {equipo.mantenimientos.length === 0 ? (
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                                No hay mantenimientos registrados para este equipo.
                                            </Typography>
                                        ) : (
                                            equipo.mantenimientos.map((mantenimiento, index) => (
                                                <React.Fragment key={index}>
                                                    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box display="flex" alignItems="center" mb={1}>
                                                                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                                                                    <Typography variant="subtitle1">
                                                                        {new Date(mantenimiento.FechaMantenimiento).toLocaleDateString()}
                                                                    </Typography>
                                                                </Box>
                                                                {mantenimiento.IdSolicitud ? (
                                                                    <PersonalAsignado 
                                                                        IdSolicitud={mantenimiento.IdSolicitud} 
                                                                        renderMode="compact"  // Opcional: para un renderizado más compacto
                                                                    />
                                                                ) : (
                                                                    <Box display="flex" alignItems="center" mb={1}>
                                                                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                                                                        <Typography variant="body2">
                                                                            {mantenimiento.Encargado || 'No disponible'}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box display="flex" alignItems="flex-start">
                                                                    <DescriptionIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                                                                    <Typography variant="body2">
                                                                        {mantenimiento.DescripcionTrabajo || 'No disponible'}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                    {mantenimiento.IdSolicitud && (
                                                        <Suspense fallback={<CircularProgress />}>
                                                            <DetalleSolicitud solicitudId={mantenimiento.IdSolicitud} />
                                                        </Suspense>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
};

export default HistorialMantenimientoEquipos;