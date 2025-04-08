import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Routes from '../../Routes/Routes';

const drawerWidth = 240;
const scaleFactor = 0.85; //  zoom

const Layout = ({ onLogout, userPermissions }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            width: '100vw',  
            overflow: 'hidden',
        }}>
            <Box sx={{
                transform: `scale(${scaleFactor})`,
                transformOrigin: 'top left',
                width: `${100 / scaleFactor}%`,
                height: `${100 / scaleFactor}%`,
            }}>
                <Header onLogout={onLogout} />
                <Box sx={{ 
                    display: 'flex', 
                    flexGrow: 1, 
                    width: '100%',
                    height: `calc(100vh / ${scaleFactor} - ${64 / scaleFactor}px)`, // Ajuste para la altura del header
                    overflow: 'hidden' 
                }}>
                    {!isMobile && (
                        <Sidebar 
                            isMobile={isMobile} 
                            drawerWidth={drawerWidth} 
                            userPermissions={userPermissions} 
                        />
                    )}
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
                            maxWidth: '100%',
                            mt: { xs: `${76 / scaleFactor}px`, sm: '0px' },
                            p: { xs: 1, sm: 2, md: 3 },
                            bgcolor: 'background.default',
                            pb: isMobile ? `${60 / scaleFactor}px` : '16px',
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            '& > *': {
                                maxWidth: '100%',
                                overflowX: 'hidden',
                            },
                        }}
                    >
                        <Routes />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;