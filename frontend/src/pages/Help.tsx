import {
    Architecture as ArchitectureIcon,
    AssessmentOutlined as AssessmentIcon,
    Build as BuildIcon,
    Engineering as EngineeringIcon,
    ExpandMore as ExpandMoreIcon,
    Info as InfoIcon,
    LibraryBooks as ProjectIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon,
    Shield as ShieldIcon
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Container,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
    useTheme
} from '@mui/material';
import React from 'react';

const Help: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Guide d'utilisation Sistema-Cloud
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom paragraph align="center">
          Comprendre les différents éléments de l'application pour l'analyse de sécurité des machines
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Vue d'ensemble
          </Typography>
          <Typography variant="body1" paragraph>
            Sistema-Cloud est une application dédiée à l'analyse de sécurité des machines selon les normes ISO 13849 et IEC 62061. 
            Elle permet de concevoir, d'analyser et de documenter des systèmes de commande relatifs à la sécurité.
          </Typography>
          <Typography variant="body1" paragraph>
            L'application est organisée autour de trois concepts principaux : les Projets, les Machines et les Fonctions de Sécurité.
          </Typography>
        </Box>
        
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="projects-content"
            id="projects-header"
            sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }}
          >
            <Box display="flex" alignItems="center">
              <ProjectIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">Projets</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Un <strong>Projet</strong> représente une analyse de sécurité complète pour une installation, une ligne de production ou un ensemble de machines.
            </Typography>
            <Typography variant="body1" paragraph>
              Le projet est le conteneur principal qui regroupe les machines et leurs fonctions de sécurité associées.
            </Typography>
            
            <Box mt={2} p={2} bgcolor={theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'} borderRadius={1}>
              <Typography variant="body2" gutterBottom fontWeight="bold">
                Exemple concret :
              </Typography>
              <Typography variant="body2" paragraph>
                Pour un système robotisé, votre <strong>projet</strong> pourrait s'intituler "Système de Robot Collaboratif XYZ", 
                englobant l'analyse de sécurité complète du système.
              </Typography>
              <Typography variant="body2">
                Ce projet contiendrait plusieurs <strong>machines</strong> : le robot lui-même, la station de charge, le contrôleur, 
                les barrières de sécurité, etc. Chaque composant majeur est considéré comme une "machine" distincte dans l'application.
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold" mt={3} mb={1}>
              Caractéristiques d'un projet :
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Informations générales" 
                  secondary="Nom, description, date de création, équipe, etc."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><AssessmentIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Niveau de performance requis (PLr)" 
                  secondary="Niveau de performance global requis pour le projet selon ISO 13849"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SecurityIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Niveau de performance atteint (PL)" 
                  secondary="Niveau de performance effectivement atteint, calculé à partir des fonctions de sécurité"
                />
              </ListItem>
            </List>
            
            <Box mt={2}>
              <Typography variant="body1">
                Utilisez la section <strong>Projets</strong> pour créer, modifier et gérer vos projets d'analyse de sécurité.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="machines-content"
            id="machines-header"
            sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }}
          >
            <Box display="flex" alignItems="center">
              <EngineeringIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">Machines</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Une <strong>Machine</strong> représente un équipement ou un système spécifique pour lequel vous effectuez une analyse de sécurité.
            </Typography>
            <Typography variant="body1" paragraph>
              Chaque machine appartient à un projet et peut avoir plusieurs fonctions de sécurité associées. 
              Dans Sistema-Cloud, le terme "machine" est utilisé au sens large et peut désigner n'importe quel équipement significatif 
              de votre installation qui nécessite une analyse de sécurité distincte.
            </Typography>

            <Box mt={2} p={2} bgcolor={theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'} borderRadius={1}>
              <Typography variant="body2" gutterBottom fontWeight="bold">
                Exemples concrets :
              </Typography>
              <Typography variant="body2" paragraph>
                Dans un système robotisé, vous pourriez avoir plusieurs "machines" distinctes :
              </Typography>
              <Typography variant="body2" sx={{ pl: 2 }} component="div">
                • Le robot lui-même (UR10, Kuka, etc.)<br />
                • La station de charge<br />
                • Le contrôleur du robot<br />
                • Le système de sécurité périphérique (barrières, scrutateurs)<br />
                • Le convoyeur d'alimentation<br />
                • Etc.
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold" mt={3} mb={1}>
              Caractéristiques d'une machine :
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Informations techniques" 
                  secondary="Nom, description, fabricant, modèle, etc."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><BuildIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Type de machine" 
                  secondary="Robot collaboratif, machine-outil, convoyeur, etc."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><ArchitectureIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Schémas et documents" 
                  secondary="Documents techniques associés à la machine"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><AssessmentIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Risques identifiés" 
                  secondary="Risques spécifiques à cette machine nécessitant des fonctions de sécurité"
                />
              </ListItem>
            </List>

            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="sub-components-content"
                id="sub-components-header"
                sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)' }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Architecture interne des machines (sous-composants)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Dans Sistema-Cloud, vous pouvez également modéliser l'architecture interne de chaque machine, en décomposant ses sous-systèmes
                  selon la norme ISO 13849.
                </Typography>
                
                <Typography variant="body2" paragraph>
                  Chaque fonction de sécurité d'une machine peut être analysée en détaillant ses sous-composants :
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="Sous-systèmes (SRP/CS)" 
                      secondary="Parties du système de commande relatives à la sécurité"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="Blocs" 
                      secondary="Composants logiques formant un sous-système (entrée, logique, sortie)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="Éléments" 
                      secondary="Composants individuels (capteurs, relais, contacteurs, API de sécurité, etc.)"
                    />
                  </ListItem>
                </List>
                
                <Box mt={2} p={2} bgcolor={theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)'} borderRadius={1}>
                  <Typography variant="body2" gutterBottom fontWeight="bold">
                    Exemple : Robot avec fonction d'arrêt de sécurité
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    <strong>Machine :</strong> Robot UR10<br />
                    <strong>Fonction de sécurité :</strong> Arrêt sécurisé<br />
                    <strong>Sous-systèmes :</strong><br />
                    • Entrée : Bouton d'arrêt d'urgence<br />
                    • Logique : Relais de sécurité ou API de sécurité<br />
                    • Sortie : Contacteurs de puissance du robot
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Box mt={3}>
              <Typography variant="body1">
                Utilisez la section <strong>Machines</strong> pour ajouter et gérer les machines de vos projets et leurs architectures internes.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="safety-functions-content"
            id="safety-functions-header"
            sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }}
          >
            <Box display="flex" alignItems="center">
              <ShieldIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">Fonctions de Sécurité</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Une <strong>Fonction de Sécurité</strong> est une mesure de protection spécifique implémentée pour réduire un risque identifié sur une machine.
            </Typography>
            <Typography variant="body1" paragraph>
              Ces fonctions sont au cœur de l'analyse Sistema, car elles déterminent le niveau de performance (PL) global du système.
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>
              Caractéristiques d'une fonction de sécurité :
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Informations de base" 
                  secondary="Nom, description, risque associé, machine concernée"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><AssessmentIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Niveau de performance requis (PLr)" 
                  secondary="Déterminé par l'évaluation des risques (gravité, fréquence, possibilité d'évitement)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SettingsIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Paramètres Sistema" 
                  secondary="Catégorie, MTTFd, DCavg, CCF"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SecurityIcon color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Niveau de performance atteint (PL)" 
                  secondary="Calculé selon ISO 13849 à partir des paramètres Sistema"
                />
              </ListItem>
            </List>
            
            <Box mt={2} p={2} bgcolor={theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'} borderRadius={1}>
              <Typography variant="body2">
                <strong>Exemple :</strong> Un arrêt d'urgence sur une presse, un verrouillage de porte sur une cellule robotisée, 
                ou un dispositif de détection de présence sur un convoyeur sont des exemples typiques de fonctions de sécurité.
              </Typography>
            </Box>
            
            <Box mt={2}>
              <Typography variant="body1">
                Utilisez la section <strong>Fonctions de Sécurité</strong> pour définir, calculer et documenter les mesures de protection de vos machines.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Flux de travail recommandé
          </Typography>
          <Typography variant="body1" paragraph>
            1. Créez un nouveau projet
          </Typography>
          <Typography variant="body1" paragraph>
            2. Ajoutez les machines concernées par l'analyse
          </Typography>
          <Typography variant="body1" paragraph>
            3. Pour chaque machine, identifiez les risques et créez les fonctions de sécurité correspondantes
          </Typography>
          <Typography variant="body1" paragraph>
            4. Configurez les paramètres de chaque fonction de sécurité selon la norme ISO 13849
          </Typography>
          <Typography variant="body1" paragraph>
            5. Analysez les résultats et générez les rapports
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Help;
