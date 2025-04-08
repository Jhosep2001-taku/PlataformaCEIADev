import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, useMediaQuery,
    IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build'; 
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { API_URL } from '../../config';
import { decrypt } from '../../utils/crypto';
import axios from 'axios';

const permissionsRequired = {
    '/usuarios': ['Administrador del Sistema', 'Gestion Usuarios'],
    '/permisos': ['Administrador del Sistema', 'Gestion Permisos'],
    '/equipos': ['Administrador del Sistema', 'Gestion Equipos'],
    '/solicitudes': ['Administrador del Sistema', 'Gestion Solicitudes'],
    '/perfil': ['Administrador del Sistema', 'Gestion Usuarios', 'Gestion Permisos', 'Gestion Equipos', 'Gestion Solicitudes'],
    '/historiales': ['Administrador del Sistema', 'Gestion Mantenimientos'],
    '/historiales-equipos': ['Administrador del Sistema', 'Historial Equipos'],
    '/calendarioTrabajo' :['Administrador del Sistema', 'Gestion Usuarios', 'Gestion Permisos', 'Gestion Equipos', 'Gestion Unidades', 'Gestion Solicitudes'], 
};

const getUserPermissions = () => {
    const encryptedUserData = localStorage.getItem('userData');
    if (encryptedUserData) {
        try {
            const userData = decrypt(encryptedUserData);
            return userData?.TipoPermiso || [];
        } catch (error) {
            console.error("Error decrypting user data:", error);
            return [];
        }
    }
    return [];
};

const MenuItems = ({ onClick }) => {
    const userPermissions = getUserPermissions();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const hasPermission = (path) => {
        const requiredPermissions = permissionsRequired[path];
        return requiredPermissions ? requiredPermissions.some(permission => userPermissions.includes(permission)) : false;
    };

    if (!isMobile) {
        return null; // No renderiza nada si no es móvil
    }

    return (
        <>
            {hasPermission('/usuarios') && (
                <ListItem button component={Link} to="/usuarios" onClick={onClick}>
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary="Usuarios" />
                </ListItem>
            )}
            {hasPermission('/permisos') && (
                <ListItem button component={Link} to="/permisos" onClick={onClick}>
                    <ListItemIcon><SecurityIcon /></ListItemIcon>
                    <ListItemText primary="Permisos" />
                </ListItem>
            )}
            {hasPermission('/equipos') && (
                <ListItem button component={Link} to="/equipos" onClick={onClick}>
                    <ListItemIcon><DeviceHubIcon /></ListItemIcon>
                    <ListItemText primary="Equipos" />
                </ListItem>
            )}
            {hasPermission('/solicitudes') && (
                <ListItem button component={Link} to="/solicitudes" onClick={onClick}>
                    <ListItemIcon><RequestQuoteIcon /></ListItemIcon>
                    <ListItemText primary="Solicitudes" />
                </ListItem>
            )}
            {hasPermission('/historiales') && (
                <ListItem button component={Link} to="/historiales" onClick={onClick}>
                    <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
                    <ListItemText primary="Mantenimiento" />
                </ListItem>
            )}
            {hasPermission('/historiales-equipos') && ( 
                <ListItem button component={Link} to="/historiales-equipos" onClick={onClick}>
                    <ListItemIcon><BuildIcon /></ListItemIcon>
                    <ListItemText primary="Historial Equipos" />
                </ListItem>
            )}
            {hasPermission('/calendarioTrabajo') && ( 
                <ListItem button component={Link} to="/calendarioTrabajo" onClick={onClick}>
                    <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
                    <ListItemText primary="Calendario" />
                </ListItem>
            )}

        </>
    );
};

const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const encryptedUserData = localStorage.getItem('userData');
            const userData = decrypt(encryptedUserData);
            const token = userData ? userData.token : null;

            await axios.post(`${API_URL}/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error during logout', error);
        } finally {
            localStorage.clear();
            window.location.reload();
        }
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: 'linear-gradient(135deg, #1976d2 10%, #9c27b0 70%)',
                    height: isMobile ? '65px' : '70px',
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '100%', // Ensure full height
                    }}
                >
                    {isMobile && (
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                        <Box sx={{ width: 240 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                            <Typography variant="h6" sx={{ p: 2 }}>Navigation</Typography>
                            <Divider />
                            <List>
                                <MenuItems onClick={toggleDrawer(false)} />
                            </List>
                        </Box>
                    </Drawer>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ textAlign: 'center', flexGrow: 2 }}>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', letterSpacing: '0.05em' }}>
                            CEIA
                        </Typography>
                        {!isMobile && (
                            <Typography variant="subtitle2" component="div" sx={{ letterSpacing: '0.02em' }}>
                                Centro Especializado Instrumental Analítica
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ flexGrow: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            color="inherit" 
                            component={Link}
                            to="/perfil"
                            startIcon={<AccountCircleIcon fontSize="large" />}
                            sx={{ 
                                borderRadius: '70px',
                                padding: '0 10px',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '100%',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            {isMobile ? '' : 'Mi Perfil'}
                        </Button>
                        {isMobile && (
                            <Button 
                                color="inherit" 
                                onClick={handleLogout}
                                startIcon={<LogoutIcon />}
                                sx={{ 
                                    borderRadius: '50px',
                                    padding: '0 10px',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '130%',
                                    ml: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                Log Out
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            {!isMobile && (
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ width: 240 }}>
                            <Typography variant="h6" sx={{ p: 2 }}>Navigation</Typography>
                            <Divider />
                            <List>
                                <MenuItems />
                            </List>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Header;
