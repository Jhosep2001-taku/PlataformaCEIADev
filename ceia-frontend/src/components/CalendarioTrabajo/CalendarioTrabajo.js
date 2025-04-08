import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Box, 
    Typography, 
    Tooltip, 
    Stack, 
    CircularProgress, 
    Alert, 
    Paper 
} from '@mui/material';
import { 
    Calendar, 
    momentLocalizer 
} from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useFetchData from '../../hooks/useFetchData';
import { API_URL } from '../../config';

moment.locale('es');
const localizer = momentLocalizer(moment);

// Función de utilidad para colores
const COLOR_MAP = {
    'Alta': 'error.main',
    'Media': 'warning.main', 
    'Baja': 'success.main',
    'default': 'grey.500'
};

const CalendarioTrabajo = ({ 
    usuarioId = 1, 
    onEventSelect 
}) => {
    // Fetch de datos con memoización
    const { 
        data: solicitudPersonal, 
        loading: loadingPersonal, 
        error: errorPersonal 
    } = useFetchData(`${API_URL}/solicitudPersonal`);
    
    const { 
        data: solicitudes, 
        loading: loadingSolicitudes, 
        error: errorSolicitudes 
    } = useFetchData(`${API_URL}/solicitudes`);
    
    const { 
        data: usuarios, 
        loading: loadingUsuarios, 
        error: errorUsuarios 
    } = useFetchData(`${API_URL}/usuarios`);

    const [events, setEvents] = useState([]);

    // Memoización de funciones y cálculos
    const getColorByPrioridad = useMemo(() => 
        (prioridad) => COLOR_MAP[prioridad] || COLOR_MAP.default
    , []); 

    // Componente de evento personalizado con más información
    const CustomMonthEvent = React.memo(({ event }) => (
        <Tooltip 
            title={
                <Stack spacing={1}>
                    <Typography variant="subtitle2" color="inherit">
                        {event.title}
                    </Typography>
                    <Typography variant="caption">
                        Unidad: {event.unidad}
                    </Typography>
                    <Typography variant="caption">
                        Prioridad: {event.prioridad}
                    </Typography>
                    <Typography variant="caption">
                        Estado: {event.estado}
                    </Typography>
                </Stack>
            }
            arrow
        >
            <Box 
                sx={{ 
                    backgroundColor: getColorByPrioridad(event.prioridad),
                    color: 'white',
                    borderRadius: 2,
                    px: 1,
                    py: 0.5,
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: 3,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6
                    }
                }}
            >
                {event.title}
            </Box>
        </Tooltip>
    ));

    // Función de días hábiles optimizada
    const isBusinessDay = useCallback((date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    }, []);

    // Procesamiento de eventos con mayor robustez
    useEffect(() => {
        if (
            solicitudPersonal && 
            solicitudes && 
            usuarios
        ) {
            const calendarioEventos = solicitudPersonal
                .filter(sp => sp.IdUsuario === usuarioId)
                .flatMap(asignacion => {
                    const solicitud = solicitudes.find(
                        s => s && s.IdSolicitud === asignacion.IdSolicitud
                    );

                    if (!solicitud) return [];

                    const start = new Date(solicitud.FechaInicio);
                    const end = new Date(solicitud.FechaFin);

                    if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

                    return generateDateEvents(start, end, solicitud, asignacion);
                });

            setEvents(calendarioEventos);
        }
    }, [solicitudPersonal, solicitudes, usuarios, usuarioId]);

    // Generación de eventos por fecha
    const generateDateEvents = useCallback((start, end, solicitud, asignacion) => {
        const eventos = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            if (isBusinessDay(currentDate)) {
                eventos.push({
                    id: asignacion.id,
                    title: `Solicitud ${solicitud.IdSolicitud}: ${solicitud.Descripcion || 'Sin descripción'}`,
                    start: new Date(currentDate),
                    end: new Date(currentDate),
                    unidad: solicitud.Unidad || '',
                    tipoTrabajo: solicitud.TipoTrabajo || '',
                    prioridad: solicitud.Prioridad || '',
                    estado: solicitud.Estado || '',
                    idSolicitud: solicitud.IdSolicitud
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return eventos;
    }, [isBusinessDay]);

    // Manejo de estados de carga y error
    if (loadingPersonal || loadingSolicitudes || loadingUsuarios) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    if (errorPersonal || errorSolicitudes || errorUsuarios) {
        return (
            <Alert severity="error">
                Error al cargar los datos. Por favor, intente nuevamente.
            </Alert>
        );
    }

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Calendario de Trabajos
            </Typography>
            
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 5 }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    components={{
                        event: CustomMonthEvent
                    }}
                    onSelectEvent={onEventSelect}
                    views={['month', 'week']}
                    culture="es"
                    defaultView="month"
                    toolbar={true}
                    step={1440} 
                    timeslots={1}
                    min={false} 
                    max={false}
                    messages={{
                        next: "Siguiente",
                        previous: "Anterior",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        agenda: "Agenda",
                        date: "Fecha",
                        time: "Hora",
                        event: "Evento"
                    }}
                />
            </Paper>
        </Box>
    );
};

export default React.memo(CalendarioTrabajo);
