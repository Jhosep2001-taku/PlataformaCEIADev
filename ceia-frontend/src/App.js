import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Container } from '@mui/material';
import { theme } from './theme';
import { decrypt } from './utils/crypto';

const Login = lazy(() => import('./components/Autentificacion/Login'));
const Layout = lazy(() => import('./components/Vistas/Layout'));

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);

    useEffect(() => {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const userData = decrypt(encryptedUserData);
            if (userData && userData.token) {
                setIsLoggedIn(true);
                setUserPermissions(userData.TipoPermiso || []);
            }
        }
    }, []); 

    const handleLoginSuccess = (loginData) => {
        setIsLoggedIn(true);
        setUserPermissions(loginData.TipoPermiso || []);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserPermissions([]);
        localStorage.removeItem('userData'); 
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                width: '100%',
                minHeight: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Suspense
                    fallback={
                        <Container
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh'
                            }}
                        >
                            <CircularProgress />
                        </Container>
                    }
                >
                    {!isLoggedIn ? (
                        <Login onLoginSuccess={handleLoginSuccess} />
                    ) : (
                        <Router>
                            <Layout onLogout={handleLogout} userPermissions={userPermissions} />
                        </Router>
                    )}
                </Suspense>
            </Box>
        </ThemeProvider>
    );
};

export default App;
