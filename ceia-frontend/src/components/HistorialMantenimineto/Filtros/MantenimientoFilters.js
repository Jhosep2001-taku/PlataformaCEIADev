
import React from 'react';
import { Grid, TextField } from '@mui/material';

export const MantenimientoFilters = ({ filters }) => {
  const { filters: filterValues, updateFilter } = filters;

  const handleFilterChange = (filterName) => (event) => {
    updateFilter(filterName, event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Buscar por nombre de equipo"
          variant="outlined"
          value={filterValues.searchTerm}
          onChange={handleFilterChange('searchTerm')}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Fecha inicio"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={filterValues.fechaInicio}
          onChange={handleFilterChange('fechaInicio')}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Fecha fin"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={filterValues.fechaFin}
          onChange={handleFilterChange('fechaFin')}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Estado"
          select
          variant="outlined"
          value={filterValues.Estado}
          onChange={handleFilterChange('estado')}
          SelectProps={{
            native: true
          }}
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="completado">Completado</option>
        </TextField>
      </Grid>
    </Grid>
  );
};