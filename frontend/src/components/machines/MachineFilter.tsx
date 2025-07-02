import { Clear as ClearIcon, FilterList as FilterIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import React from 'react';

export interface MachineFilters {
  search: string;
  status: 'all' | 'operational' | 'maintenance' | 'offline';
  manufacturer: string;
  yearFrom: string;
  yearTo: string;
}

interface MachineFilterProps {
  filters: MachineFilters;
  onFilterChange: (filters: MachineFilters) => void;
  manufacturers: string[];
}

const MachineFilter: React.FC<MachineFilterProps> = ({ 
  filters, 
  onFilterChange, 
  manufacturers 
}) => {
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    onFilterChange({ 
      ...filters, 
      status: e.target.value as MachineFilters['status'] 
    });
  };

  const handleManufacturerChange = (e: SelectChangeEvent<string>) => {
    onFilterChange({ ...filters, manufacturer: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      manufacturer: '',
      yearFrom: '',
      yearTo: ''
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterIcon sx={{ mr: 1 }} />
        <Box sx={{ flexGrow: 1 }}>Filtres</Box>
        <Button 
          size="small" 
          startIcon={<ClearIcon />} 
          onClick={clearFilters}
          sx={{ ml: 1 }}
        >
          Effacer
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Recherche"
            name="search"
            value={filters.search}
            onChange={handleTextChange}
            placeholder="Nom, modèle, numéro de série..."
            size="small"
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Statut</InputLabel>
            <Select
              value={filters.status}
              label="Statut"
              onChange={handleStatusChange}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="operational">En fonctionnement</MenuItem>
              <MenuItem value="maintenance">En maintenance</MenuItem>
              <MenuItem value="offline">Hors ligne</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Fabricant</InputLabel>
            <Select
              value={filters.manufacturer}
              label="Fabricant"
              onChange={handleManufacturerChange}
            >
              <MenuItem value="">Tous</MenuItem>
              {manufacturers.map((manufacturer) => (
                <MenuItem key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Année depuis"
            name="yearFrom"
            value={filters.yearFrom}
            onChange={handleTextChange}
            placeholder="Ex: 2010"
            size="small"
            type="number"
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Année jusqu'à"
            name="yearTo"
            value={filters.yearTo}
            onChange={handleTextChange}
            placeholder="Ex: 2023"
            size="small"
            type="number"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MachineFilter;
