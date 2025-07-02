import {
    Build as BuildIcon,
    Schedule as ScheduleIcon,
    Security as SecurityIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    LinearProgress,
    Typography
} from '@mui/material';
import React from 'react';
import { Machine } from '../../services/mockDataService';

interface MachineStatsProps {
  machines: Machine[];
}

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, color = 'primary' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
    <Box
      sx={{
        backgroundColor: `${color}.light`,
        color: `${color}.dark`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        width: 40,
        height: 40,
        mr: 2
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" component="div">
        {value}
      </Typography>
    </Box>
  </Box>
);

const MachineStats: React.FC<MachineStatsProps> = ({ machines }) => {
  // Calcul des statistiques
  const totalMachines = machines.length;
  const operationalMachines = machines.filter(m => m.status === 'operational').length;
  const maintenanceMachines = machines.filter(m => m.status === 'maintenance').length;
  const offlineMachines = machines.filter(m => m.status === 'offline').length;

  const operationalPercentage = totalMachines > 0 ? (operationalMachines / totalMachines) * 100 : 0;
  
  const currentYear = new Date().getFullYear();
  const machinesOlderThan10Years = machines.filter(m => currentYear - m.yearOfManufacture >= 10).length;
  const machinesOlderThan10YearsPercentage = totalMachines > 0 ? (machinesOlderThan10Years / totalMachines) * 100 : 0;
  
  // Fabricants les plus courants
  const manufacturersCount = machines.reduce((acc, machine) => {
    acc[machine.manufacturer] = (acc[machine.manufacturer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topManufacturers = Object.entries(manufacturersCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Statistiques des Machines
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StatItem 
              label="Total des machines" 
              value={totalMachines} 
              icon={<BuildIcon />} 
            />
            <StatItem 
              label="En fonctionnement" 
              value={`${operationalMachines} (${operationalPercentage.toFixed(0)}%)`} 
              icon={<SecurityIcon />}
              color="success" 
            />
            <StatItem 
              label="En maintenance" 
              value={maintenanceMachines} 
              icon={<ScheduleIcon />}
              color="warning" 
            />
            <StatItem 
              label="Hors ligne" 
              value={offlineMachines} 
              icon={<WarningIcon />}
              color="error" 
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Équipement en fonctionnement
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={operationalPercentage} 
              color="success"
              sx={{ height: 10, borderRadius: 5, mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Équipement {'>'} 10 ans
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={machinesOlderThan10YearsPercentage} 
                color={machinesOlderThan10YearsPercentage > 50 ? "error" : "warning"}
                sx={{ height: 10, borderRadius: 5, flexGrow: 1, mr: 2 }}
              />
              <Typography variant="body2">
                {machinesOlderThan10Years}/{totalMachines}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
              Principaux fabricants
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {topManufacturers.map(([manufacturer, count]) => (
                <Chip 
                  key={manufacturer}
                  label={`${manufacturer} (${count})`}
                  size="small"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MachineStats;
