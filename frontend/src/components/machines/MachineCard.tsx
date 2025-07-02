import {
    Build as BuildIcon,
    Check as CheckIcon,
    PowerOff as PowerOffIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Grid,
    Typography
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Machine } from '../../services/mockDataService';

interface MachineCardProps {
  machine: Machine;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  const navigate = useNavigate();
  
  const getStatusIcon = () => {
    switch (machine.status) {
      case 'operational':
        return <CheckIcon />;
      case 'maintenance':
        return <BuildIcon />;
      case 'offline':
        return <PowerOffIcon />;
      default:
        return <SettingsIcon />;
    }
  };
  
  const getStatusColor = () => {
    switch (machine.status) {
      case 'operational':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (machine.status) {
      case 'operational':
        return 'En fonctionnement';
      case 'maintenance':
        return 'En maintenance';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'Inconnu';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardActionArea 
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }} 
        onClick={() => navigate(`/machines/${machine.id}`)}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2" gutterBottom={false}>
              {machine.name}
            </Typography>
            <Chip
              icon={getStatusIcon()}
              label={getStatusText()}
              color={getStatusColor() as any}
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {machine.description}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" component="div">
                <strong>Fabricant:</strong>
              </Typography>
              <Typography variant="body2">
                {machine.manufacturer}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" component="div">
                <strong>Modèle:</strong>
              </Typography>
              <Typography variant="body2">
                {machine.model}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" component="div">
                <strong>Année:</strong>
              </Typography>
              <Typography variant="body2">
                {machine.yearOfManufacture}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" component="div">
                <strong>Dernière maintenance:</strong>
              </Typography>
              <Typography variant="body2">
                {formatDate(machine.lastMaintenanceDate)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MachineCard;
