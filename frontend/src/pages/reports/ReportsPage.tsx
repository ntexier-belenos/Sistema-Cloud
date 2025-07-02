import { Box, Container, Typography, Paper, Grid, Card, CardContent, CardHeader, Divider, Button } from '@mui/material';
import { Assessment as AssessmentIcon, Download as DownloadIcon, Print as PrintIcon } from '@mui/icons-material';
import React from 'react';

/**
 * Reports page
 * Displays various reports and analytics for safety assessments
 */
const ReportsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Generate and view reports for your safety assessments and projects.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Report Generation
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              This module will allow you to generate comprehensive reports for safety assessments,
              including CE/UKCA compliance documentation.
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardHeader title="Available Reports" />
              <Divider />
              <CardContent>
                <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                  The reports module is currently in development and will be available in a future release.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Safety Assessment Report</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Comprehensive report for machine safety assessment
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          startIcon={<DownloadIcon />}
                          disabled
                          fullWidth 
                          sx={{ mt: 2 }}
                        >
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">CE Compliance Report</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Documentation for CE marking compliance
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary"
                          startIcon={<PrintIcon />}
                          disabled
                          fullWidth 
                          sx={{ mt: 2 }}
                        >
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Project Summary</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Overview of all safety functions in a project
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary"
                          startIcon={<DownloadIcon />}
                          disabled
                          fullWidth 
                          sx={{ mt: 2 }}
                        >
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ReportsPage;
