# Documentation du DataProvider

## Introduction

Le DataProvider est un système de gestion d'état centralisé pour l'application Sistema-Cloud. Il utilise le Context API de React pour fournir un accès global aux données et aux fonctions de manipulation de ces données à travers l'application.

## Architecture générale

### Principes fondamentaux

Le DataProvider est basé sur les principes suivants :

- **Source unique de vérité** : Toutes les données de l'application sont stockées dans un seul endroit
- **État immuable** : Les données ne sont pas modifiées directement mais à travers des fonctions spécifiques
- **Accès centralisé** : Un seul point d'accès pour toutes les opérations CRUD (Create, Read, Update, Delete)
- **Gestion d'état asynchrone** : Gestion des états de chargement et des erreurs pour chaque type de données

### Composants principaux

1. **DataContext** : Le contexte React qui contient toutes les données et fonctions
2. **DataProvider** : Le composant qui encapsule l'application et fournit le contexte
3. **useData** : Un hook personnalisé pour accéder au contexte dans les composants
4. **useSafeData** : Un hook sécurisé qui fonctionne même en dehors du DataProvider

## Mise en œuvre technique

### Création du contexte

```tsx
const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  return context;
};
```

### Structure du DataProvider

```tsx
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // États pour stocker les données
  // ...
  return (
    <DataContext.Provider value={/* toutes les données et fonctions */}>
      {children}
    </DataContext.Provider>
  );
};
```

### Intégration dans l'application

Le DataProvider est intégré dans MainLayout pour garantir que toutes les pages protégées ont accès au contexte:

```tsx
// Dans MainLayout.tsx
<Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    mt: "64px",
  }}
>
  <DataProvider>
    <Outlet />
  </DataProvider>
</Box>
```

## Chargement des données en absence de backend

En l'absence d'un backend opérationnel, notre application utilise un service de mock pour simuler les interactions avec une API. Ce système permet le développement frontend indépendamment du backend.

### Implémentation du service mock

Le service de mock (`mockDataService.ts`) génère et gère des données fictives qui imitent la structure des réponses attendues de l'API réelle. Le service inclut:

1. **Données par défaut** : Un ensemble de données pour les projets, machines, fonctions de sécurité, etc.
2. **Opérations CRUD complètes** : Toutes les opérations de création, lecture, mise à jour et suppression
3. **Simulation d'API asynchrone** : Les fonctions retournent des Promises pour imiter les appels API réels

### Persistance locale des données

Pour améliorer l'expérience utilisateur et permettre de tester l'application plus efficacement, nous avons ajouté une couche de persistance locale:

1. **localStorage** : Sauvegarde des données entre les sessions dans le navigateur
2. **Chargement automatique** : Restauration des données au démarrage de l'application
3. **Actualisation transparente** : Mise à jour du stockage local à chaque modification

```tsx
// Exemple de sauvegarde dans le localStorage
saveToLocalStorage({ projects: mockProjects });
```

### Gestion des erreurs et conditions réseau

Pour faciliter les tests et améliorer la robustesse de l'application, nous avons implémenté un simulateur de conditions réseau qui permet de:

1. **Simuler la latence** : Ajouter des délais configurables aux appels API
2. **Simuler les erreurs** : Générer des erreurs aléatoires avec une probabilité configurable
3. **Simuler les timeouts** : Provoquer des timeouts pour tester la gestion des délais d'expiration

```tsx
// Exemple d'utilisation du simulateur réseau
const result = await simulateNetwork(
  () => mockDataService.getProjects(),
  "Failed to load projects"
);
```

### Mécanisme de fallback pour les contextes manquants

Pour les composants qui pourraient être rendus en dehors du DataProvider, nous avons mis en place un hook `useSafeData` qui:

1. Tente d'utiliser le DataContext s'il est disponible
2. Bascule vers une implémentation locale utilisant directement le mockDataService si nécessaire

```tsx
const MyComponent = () => {
  // Ce hook fonctionne même si le composant n'est pas enfant de DataProvider
  const { projects, isLoading, errors } = useSafeData();
  // ...
};
```

### Outils de développement

Pour faciliter le développement et les tests, nous avons ajouté un panel d'outils accessibles dans l'interface:

1. **Configuration du simulateur réseau** : Ajuster les paramètres de latence, erreurs et timeouts
2. **Gestion des données** : Réinitialisation ou effacement des données stockées
3. **Monitoring d'état** : Visualisation de l'état actuel des données

## Bonnes pratiques d'utilisation

1. **Toujours utiliser les hooks fournis** (useData ou useSafeData) pour accéder aux données
2. **Déstructurer uniquement les données nécessaires** pour éviter les re-rendus inutiles
3. **Utiliser les fonctions du contexte** plutôt que de modifier les données directement
4. **Gérer les états de chargement et d'erreur** dans les composants pour améliorer l'expérience utilisateur

## Exemple d'utilisation

```tsx
const MyComponent: React.FC = () => {
  const { machines, isLoading, errors, refreshMachines } = useData();

  useEffect(() => {
    refreshMachines();
  }, [refreshMachines]);

  if (isLoading.machines) {
    return <CircularProgress />;
  }

  if (errors.machines) {
    return <Typography color="error">{errors.machines}</Typography>;
  }

  return (
    <div>
      {machines.map((machine) => (
        <div key={machine.id}>{machine.name}</div>
      ))}
    </div>
  );
};
```

## Améliorations futures

- Mise en place d'un système de mise à jour en temps réel (WebSockets)
- Intégration d'un middleware pour la validation des données
- Implémentation d'un système de pagination pour les grandes collections de données
- Gestion avancée de l'optimisme UI (mise à jour optimiste)
- Migration progressive vers une API réelle lorsque le backend sera disponible
