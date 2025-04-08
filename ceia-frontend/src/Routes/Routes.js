import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../components/Autentificacion/Unauthorized';
import CircularProgress from '@mui/material/CircularProgress';

// Lazy load components
const Usuarios = lazy(() => import('../components/Usuarios/Usuarios'));
const Permisos = lazy(() => import('../components/Permisos/Permisos'));
const Equipos = lazy(() => import('../components/Equipos/Equipos'));
const Unidades = lazy(() => import('../components/Unidad/Unidades'));
const ListarSolicitudes = lazy(() => import('../components/solicitudes/ListarSolicitudes'));
const PerfilUsuario = lazy(() => import('../components/Perfil/PerfilUsuario'));
const HistorialMantenimientos = lazy(() => import('../components/HistorialMantenimineto/HistorialMantenimientos'));
const HistorialMantenimientosEquipos = lazy(() => import('../components/HistorialEquipos/HistorialMantenimientoEquipos')); 
const CalendarioTrabajo = lazy(() => import('../components/CalendarioTrabajo/CalendarioTrabajo'));
const Informes = lazy(() => import('../components/HistorialMantenimineto/Informes/InformeMantenimiento'));

const permissionsRequired = {
    '/usuarios': ['Administrador del Sistema', 'Gestion Usuarios'],
    '/permisos': ['Administrador del Sistema', 'Gestion Permisos'],
    '/equipos': ['Administrador del Sistema', 'Gestion Equipos'],
    '/unidades': ['Administrador del Sistema', 'Gestion Unidades'],
    '/informes': ['Administrador del Sistema',  'Gestion Mantenimientos'],
    '/solicitudes': ['Administrador del Sistema', 'Gestion Solicitudes'],
    '/perfil': ['Administrador del Sistema', 'Gestion Usuarios', 'Gestion Permisos', 'Gestion Equipos', 'Gestion Unidades', 'Gestion Solicitudes'],
    '/historiales': ['Administrador del Sistema', 'Gestion Mantenimientos'],
    '/historiales-equipos': ['Administrador del Sistema', 'Historial Equipos'] ,
    '/calendarioTrabajo' :['Administrador del Sistema', 'Gestion Usuarios', 'Gestion Permisos', 'Gestion Equipos', 'Gestion Unidades', 'Gestion Solicitudes'],
};

const AppRoutes = () => (
    <Suspense fallback={<CircularProgress />}>
        <Routes>
            {/* Root path redirects to /solicitudes */}
            <Route path="/" element={<Navigate to="/solicitudes" replace />} />
            
            <Route 
                path="/solicitudes" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/solicitudes']}>
                        <ListarSolicitudes />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/usuarios" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/usuarios']}>
                        <Usuarios />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/permisos" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/permisos']}>
                        <Permisos />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/equipos" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/equipos']}>
                        <Equipos />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/unidades" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/unidades']}>
                        <Unidades />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/perfil" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/perfil']}>
                        <PerfilUsuario />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/historiales" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/historiales']}>
                        <HistorialMantenimientos />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/historiales-equipos" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/historiales-equipos']}>
                        <HistorialMantenimientosEquipos />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/calendarioTrabajo" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/calendarioTrabajo']}>
                        <CalendarioTrabajo />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/informes/:idSolicitud" 
                element={
                    <ProtectedRoute allowedPermissions={permissionsRequired['/informes']}>
                    <Informes />
                    </ProtectedRoute>
                } 
            />
                
            <Route path="*" element={<Navigate to="/solicitudes" replace />} /> 
        </Routes>
    </Suspense>
);

export default AppRoutes;
