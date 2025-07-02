// fixMachineDataConsistency.js - Script pour corriger le problème d'incohérence des machines

// Fonction de correction pour résoudre les problèmes
function fixMachineDataConsistency() {
  console.log('========== CORRECTION DES DONNÉES MACHINES ==========');
  
  try {
    // Récupérer les données actuelles
    const systemCloudData = localStorage.getItem('sistema_cloud_projects') || '[]';
    const projectsData = JSON.parse(systemCloudData);
    
    const systemCloudMachines = localStorage.getItem('sistema_cloud_machines') || '[]';
    const machinesData = JSON.parse(systemCloudMachines);
    
    console.log(`État initial: ${projectsData.length} projets, ${machinesData.length} machines`);
    
    // Vérifier si les machines ont bien des projectId valides
    const projectIds = new Set(projectsData.map(p => p.id));
    const validMachines = machinesData.filter(m => !m.projectId || projectIds.has(m.projectId));
    const invalidMachines = machinesData.filter(m => m.projectId && !projectIds.has(m.projectId));
    
    if (invalidMachines.length > 0) {
      console.log(`${invalidMachines.length} machines avec des projectId invalides ont été détectées`);
      console.log('Ces machines seront rattachées au premier projet ou en créant un projet si nécessaire');
      
      // Corriger les machines avec projectId invalide
      const fixedMachines = [...machinesData];
      
      invalidMachines.forEach(machine => {
        const index = fixedMachines.findIndex(m => m.id === machine.id);
        if (index !== -1) {
          if (projectsData.length > 0) {
            // Rattacher au premier projet
            fixedMachines[index] = {
              ...fixedMachines[index],
              projectId: projectsData[0].id
            };
            console.log(`Machine ${machine.name} (${machine.id}) rattachée au projet ${projectsData[0].name}`);
          } else {
            // Créer un nouveau projet et y rattacher la machine
            const newProject = {
              id: 'fixed-project-1',
              name: 'Projet de récupération',
              description: 'Projet créé automatiquement pour récupérer les machines orphelines',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            projectsData.push(newProject);
            
            fixedMachines[index] = {
              ...fixedMachines[index],
              projectId: newProject.id
            };
            console.log(`Machine ${machine.name} (${machine.id}) rattachée au nouveau projet ${newProject.name}`);
          }
        }
      });
      
      // Sauvegarder les modifications
      localStorage.setItem('sistema_cloud_machines', JSON.stringify(fixedMachines));
      localStorage.setItem('sistema_cloud_projects', JSON.stringify(projectsData));
      
      console.log('Données corrigées et sauvegardées');
    } else if (machinesData.length === 0) {
      console.log('Aucune machine trouvée dans le localStorage. Réinitialisation des données...');
      
      // Créer des données par défaut
      const defaultProjects = [
        {
          id: 'default-1',
          name: 'Ligne d\'assemblage A',
          description: 'Ligne d\'assemblage principale pour les moteurs électriques',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'default-2',
          name: 'Cellule robotisée B',
          description: 'Cellule avec robots collaboratifs pour l\'assemblage de précision',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      const defaultMachines = [
        {
          id: 'default-machine-1',
          projectId: 'default-1',
          name: 'Robot 1',
          description: 'Robot articulé 6 axes',
          model: 'KR 1000',
          serialNumber: 'KR1000-123456',
          manufacturer: 'KUKA',
          yearOfManufacture: 2020,
          status: 'operational',
          lastMaintenanceDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'default-machine-2',
          projectId: 'default-1',
          name: 'Convoyeur A',
          description: 'Convoyeur principal',
          model: 'CV-2000',
          serialNumber: 'CV2000-78910',
          manufacturer: 'ConveyTech',
          yearOfManufacture: 2019,
          status: 'maintenance',
          lastMaintenanceDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'default-machine-3',
          projectId: 'default-2',
          name: 'Cobot 1',
          description: 'Robot collaboratif',
          model: 'UR10e',
          serialNumber: 'UR10E-567890',
          manufacturer: 'Universal Robots',
          yearOfManufacture: 2021,
          status: 'operational',
          lastMaintenanceDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      // Sauvegarder les données par défaut
      localStorage.setItem('sistema_cloud_projects', JSON.stringify(defaultProjects));
      localStorage.setItem('sistema_cloud_machines', JSON.stringify(defaultMachines));
      
      // Mettre à jour la dernière date de modification
      localStorage.setItem('sistema_cloud_last_updated', new Date().toISOString());
      
      console.log('Données par défaut créées et sauvegardées');
    } else {
      console.log('Les données semblent être correctes, aucune correction nécessaire');
    }
    
    console.log('Vérification des données après correction:');
    const updatedProjects = JSON.parse(localStorage.getItem('sistema_cloud_projects') || '[]');
    const updatedMachines = JSON.parse(localStorage.getItem('sistema_cloud_machines') || '[]');
    
    console.log(`État final: ${updatedProjects.length} projets, ${updatedMachines.length} machines`);
  } catch (error) {
    console.error('Erreur lors de la correction des données:', error);
  }
  
  console.log('================================================');
  console.log('Rechargez la page pour appliquer les corrections');
}

// Exécuter la correction
fixMachineDataConsistency();

// Exposer la fonction pour une utilisation ultérieure
window.fixMachineDataConsistency = fixMachineDataConsistency;
