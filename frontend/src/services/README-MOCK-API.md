# Guide du système de test frontend (Mock API)

Ce document fournit des instructions pour utiliser et configurer le système de test frontend en l'absence de backend.

## Vue d'ensemble

Pour faciliter le développement frontend indépendamment du backend, nous avons mis en place un système complet qui inclut:

1. **Mock Data Service** - Génère et gère des données fictives
2. **Persistance locale** - Sauvegarde les données dans le localStorage
3. **Simulateur réseau** - Simule des conditions réseau réelles (latence, erreurs, timeouts)
4. **API Adapter** - Permet de basculer facilement entre l'API réelle et les données mock
5. **Outils de développement** - Interface pour gérer les données et les conditions de test

## Configuration

### Activer/désactiver le mode mock

Deux méthodes sont disponibles:

1. **Variables d'environnement**:

   ```
   REACT_APP_USE_MOCK_API=true
   ```

2. **Dynamiquement via l'interface développeur**:
   - Cliquer sur l'icône 🐞 en bas à droite
   - Utiliser l'option de bascule dans le panneau "Réseau"

### Personnalisation des données mock

Pour personnaliser les données de test par défaut, modifiez les tableaux dans `mockDataService.ts`:

```typescript
// Par exemple, pour ajouter un projet de test
let mockProjects: Project[] = [
  // ...données existantes
  {
    id: "4",
    name: "Mon projet de test",
    description: "Description personnalisée",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
```

## Outils de développement disponibles

### Simulateur réseau

Permet de configurer:

- Latence (délai min/max)
- Probabilité d'erreurs
- Simulation de timeout

### Gestion des données

- Réinitialisation des données (retour aux valeurs par défaut)
- Effacement du localStorage

### Scénarios de test

Interface permettant d'exécuter des scénarios prédéfinis:

- Création automatique de multiples entités
- Simulation de cas d'erreur spécifiques

## Création de scénarios de test personnalisés

Pour ajouter un nouveau scénario de test:

1. Définir la fonction dans `useDevTesting.ts`:

```typescript
const generateTestScenarios = {
  // ...scénarios existants

  // Nouveau scénario
  createComplexProject: async () => {
    try {
      const project = await apiAdapter.projects.create({
        name: "Projet complexe",
        description: "Projet avec plusieurs machines et fonctions de sécurité",
      });

      // Ajouter des machines au projet
      for (let i = 0; i < 3; i++) {
        await apiAdapter.machines.create({
          projectId: project.id,
          name: `Machine ${i + 1}`,
          // ...autres propriétés
        });
      }

      return true;
    } catch (error) {
      console.error("Erreur:", error);
      return false;
    }
  },
};
```

2. Ajouter le scénario à la liste dans `TestScenarios.tsx`:

```typescript
const scenarios = [
  // ...scénarios existants
  {
    id: "createComplexProject",
    name: "Créer un projet complexe",
    description: "Génère un projet avec plusieurs machines",
    params: [],
  },
];
```

## Meilleures pratiques

1. **Toujours utiliser l'adaptateur API** (`apiAdapter.ts`) plutôt que d'appeler directement `mockDataService` ou `api.ts`
2. **Gérer les états de chargement et les erreurs** dans les composants
3. **Éviter de modifier directement les données** dans les tableaux mock
4. **Utiliser le hook `useSafeData`** pour les composants qui peuvent être rendus en dehors du DataProvider
5. **Tester régulièrement avec le simulateur réseau** pour s'assurer que l'application gère correctement les erreurs

## Transition vers l'API réelle

Quand le backend sera disponible, la transition sera simple:

1. Désactiver le mode mock en définissant `REACT_APP_USE_MOCK_API=false`
2. Configurer l'URL de l'API avec `REACT_APP_API_URL=http://localhost:8000`
3. Vérifier que toutes les routes d'API dans `api.ts` correspondent à celles du backend
