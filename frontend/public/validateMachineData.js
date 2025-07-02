// validateMachineData.js - Script pour diagnostiquer le problème d'incohérence des machines

// Récupérer les données du localStorage
function getLocalStorageData() {
  try {
    const storageData = localStorage.getItem('sistema_cloud_data');
    if (storageData) {
      return JSON.parse(storageData);
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage:', error);
  }
  return null;
}

// Analyser les données
function analyzeMachineData() {
  console.log('========== DIAGNOSTIC DES DONNÉES MACHINES ==========');
  
  // Récupérer les données du localStorage
  const storageData = getLocalStorageData();
  
  if (!storageData) {
    console.log('Aucune donnée dans le localStorage');
    return;
  }
  
  // Vérifier les machines
  const { machines = [], projects = [] } = storageData;
  
  console.log(`Nombre total de machines dans localStorage: ${machines.length}`);
  console.log(`Nombre total de projets dans localStorage: ${projects.length}`);
  
  // Analyser les machines par projet
  const machinesByProject = new Map();
  const machinesWithoutProject = [];
  
  machines.forEach(machine => {
    if (!machine.projectId) {
      machinesWithoutProject.push(machine);
      return;
    }
    
    if (!machinesByProject.has(machine.projectId)) {
      machinesByProject.set(machine.projectId, []);
    }
    
    machinesByProject.get(machine.projectId).push(machine);
  });
  
  console.log(`Machines sans projet: ${machinesWithoutProject.length}`);
  console.log('Machines par projet:');
  
  machinesByProject.forEach((projectMachines, projectId) => {
    const project = projects.find(p => p.id === projectId);
    console.log(`  - Projet ${projectId} (${project?.name || 'Inconnu'}): ${projectMachines.length} machines`);
  });
  
  // Vérifier les projectIds invalides
  const projectIds = new Set(projects.map(p => p.id));
  const machinesWithInvalidProjectId = machines.filter(m => m.projectId && !projectIds.has(m.projectId));
  
  if (machinesWithInvalidProjectId.length > 0) {
    console.log(`ERREUR: ${machinesWithInvalidProjectId.length} machines ont un projectId qui ne correspond à aucun projet existant:`);
    machinesWithInvalidProjectId.forEach(m => {
      console.log(`  - Machine ${m.id} (${m.name}) avec projectId invalide: ${m.projectId}`);
    });
  }
  
  // Vérifier l'état du mock
  console.log('\nVérification de l\'état du mock dans window.mockDataService:');
  if (window.mockMachines) {
    console.log(`Nombre de machines dans mockMachines: ${window.mockMachines.length}`);
  } else {
    console.log('mockMachines n\'est pas exposé comme variable globale');
  }
  
  console.log('\nConclusion:');
  if (machines.length === 0) {
    console.log('Le problème principal est qu\'aucune machine n\'est stockée dans le localStorage.');
    console.log('Solutions possibles:');
    console.log('1. Vérifiez que les données par défaut sont correctement initialisées');
    console.log('2. Vérifiez que mockDataService.getMachines() retourne bien les machines');
    console.log('3. Essayez de réinitialiser les données en utilisant l\'outil de développement');
  } else if (machinesWithInvalidProjectId.length > 0) {
    console.log('Le problème principal est que certaines machines ont des projectId invalides.');
    console.log('Solutions possibles:');
    console.log('1. Corrigez les projectId des machines concernées');
    console.log('2. Créez les projets manquants correspondant à ces projectId');
    console.log('3. Réinitialisez complètement les données');
  } else {
    console.log('Les données semblent correctes dans le localStorage.');
    console.log('Le problème pourrait être lié à:');
    console.log('1. Le chargement des données depuis localStorage vers mockMachines');
    console.log('2. L\'affichage des machines dans la vue générale (filtre incorrect?)');
    console.log('3. Une condition dans DataContext qui filtre les machines incorrectement');
  }
  
  console.log('================================================');
}

// Exécuter l'analyse
analyzeMachineData();

// Exposer la fonction pour une utilisation ultérieure
window.analyzeMachineData = analyzeMachineData;
window.clearAndResetData = function() {
  localStorage.clear();
  console.log('localStorage effacé. Rechargez la page pour réinitialiser les données.');
};

// Afficher les machines et les projets actuel
console.log('\nDonnées actuelles en mémoire:');
console.log('mockMachines:', window.mockMachines);
console.log('mockProjects:', window.mockProjects);
