import {
    Archive as ArchiveIcon,
    CheckCircleOutline as CheckIcon,
    Engineering as EngineeringIcon,
    Folder as FolderIcon,
    FolderOff as FolderOffIcon,
    Shield as ShieldIcon,
    WarningAmber as WarningIcon
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

import mockDataService from '../services/mockDataService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  projects: {
    total: number;
    active: number;
    archived: number;
    by_status: {
      draft: number;
      in_progress: number;
      completed: number;
      archived: number;
    };
  };
  machines: {
    total: number;
    by_risk: {
      low: number;
      medium: number;
      high: number;
    };
  };
  safety_functions: {
    total: number;
    by_status: {
      compliant: number;
      non_compliant: number;
    };
    by_pl: {
      a: number;
      b: number;
      c: number;
      d: number;
      e: number;
    };
  };
}

// Import the Project type from mockDataService
import { Project } from '../services/mockDataService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  // Définir un état initial par défaut pour éviter les erreurs d'accès aux propriétés undefined
  const [stats, setStats] = useState<DashboardStats | null>({
    projects: {
      total: 0,
      active: 0,
      archived: 0,
      by_status: {
        draft: 0,
        in_progress: 0,
        completed: 0,
        archived: 0,
      }
    },
    machines: {
      total: 0,
      by_risk: {
        low: 0,
        medium: 0,
        high: 0,
      }
    },
    safety_functions: {
      total: 0,
      by_status: {
        compliant: 0,
        non_compliant: 0,
      },
      by_pl: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
      }
    }
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard stats and projects in parallel
        const [statsResponse, projectsResponse] = await Promise.all([
          mockDataService.getDashboardStats(),
          mockDataService.getProjects()
        ]);
        
        setStats(statsResponse);
        setProjects(projectsResponse);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare chart data for safety functions by PL
  const safetyFunctionChartData = {
    labels: ['PL a', 'PL b', 'PL c', 'PL d', 'PL e'],
    datasets: [
      {
        label: 'Safety Functions',
        data: stats ? [
          stats.safety_functions.by_pl.a,
          stats.safety_functions.by_pl.b,
          stats.safety_functions.by_pl.c, 
          stats.safety_functions.by_pl.d,
          stats.safety_functions.by_pl.e
        ] : [0, 0, 0, 0, 0],
        backgroundColor: [
          '#4caf50', // Green for PL a
          '#8bc34a', // Light green for PL b
          '#ffeb3b', // Yellow for PL c
          '#ff9800', // Orange for PL d
          '#f44336', // Red for PL e
        ],
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, bgcolor: '#fff8f8' }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Vue d'ensemble de vos projets et analyses de sécurité
        </Typography>
      </Box>

      {/* Stats Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Projects Stats */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: muiTheme.palette.primary.main, mr: 2 }}>
                  <FolderIcon />
                </Avatar>
                <Typography variant="h6">Projets</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {stats ? stats.projects.total : 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<CheckIcon />} 
                  label={`${stats ? stats.projects.active : 0} actifs`}
                  size="small"
                  color="success"
                />
                <Chip 
                  icon={<ArchiveIcon />} 
                  label={`${stats ? stats.projects.archived : 0} archivés`}
                  size="small"
                  color="default"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Machines Stats */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: muiTheme.palette.secondary.main, mr: 2 }}>
                  <EngineeringIcon />
                </Avatar>
                <Typography variant="h6">Machines</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {stats ? stats.machines.total : 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${stats ? stats.machines.by_risk.high : 0} risque élevé`}
                  size="small"
                  color="error"
                />
                <Chip 
                  label={`${stats ? stats.machines.by_risk.medium : 0} risque moyen`}
                  size="small"
                  color="warning"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Safety Functions Stats */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f44336', mr: 2 }}>
                  <ShieldIcon />
                </Avatar>
                <Typography variant="h6">Fonctions de Sécurité</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {stats ? stats.safety_functions.total : 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<CheckIcon />} 
                  label={`${stats ? stats.safety_functions.by_status.compliant : 0} conformes`}
                  size="small"
                  color="success"
                />
                <Chip 
                  icon={<WarningIcon />} 
                  label={`${stats ? stats.safety_functions.by_status.non_compliant : 0} non conformes`}
                  size="small"
                  color="error"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Projects */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Projets récents
            </Typography>
            <List>
              {projects.length > 0 ? (
                projects.slice(0, 5).map((project, index) => (
                  <React.Fragment key={project.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        py: 1.5
                      }}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {project.name}
                            </Typography>
                            <Chip
                              label="Actif"
                              size="small"
                              color="success"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" component="span">
                              {project.description.length > 120 
                                ? project.description.substring(0, 120) + '...' 
                                : project.description}
                            </Typography>
                            <Box sx={{ display: 'flex', mt: 1, gap: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                <b>Créé le:</b> {new Date(project.createdAt).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                <b>Mis à jour le:</b> {new Date(project.updatedAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < projects.slice(0, 5).length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <FolderOffIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Aucun projet trouvé
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/projects/new')}
                  >
                    Créer un projet
                  </Button>
                </Box>
              )}
            </List>
            {projects.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/projects')}
                >
                  Voir tous les projets
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Safety Functions by PL Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Fonctions de Sécurité par PL
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <Bar data={safetyFunctionChartData} options={chartOptions} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="text" 
                color="primary" 
                onClick={() => navigate('/safety-functions')}
                sx={{ textTransform: 'none' }}
              >
                Voir toutes les fonctions de sécurité
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
