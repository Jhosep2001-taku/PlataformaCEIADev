import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useTheme } from '@mui/material/styles';

const Unauthorized = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
        }}
      >
        <LockIcon
          sx={{
            fontSize: 60,
            color: theme.palette.error.main,
            marginBottom: 2,
          }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Acceso No Autorizado
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Lo sentimos, no tienes permiso para acceder a esta página. Por favor, verifica tus credenciales o contacta al administrador del sistema.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/"
          sx={{ marginTop: 2 }}
        >
          Volver a la página principal
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorized;