/**
 * Service pour simuler les conditions réseau et les erreurs
 * Ce service permet de tester la robustesse de l'application en simulant
 * des problèmes réseau tels que la latence, les timeout et les erreurs.
 */

// Configuration par défaut
let config = {
  enabled: false, // Désactivé par défaut
  latency: {
    enabled: false,
    minMs: 300,
    maxMs: 1500
  },
  errors: {
    enabled: false,
    probability: 0.2 // 20% de chance d'erreur
  },
  timeout: {
    enabled: false,
    probability: 0.1, // 10% de chance de timeout
    timeoutMs: 5000
  }
};

/**
 * Simule une opération réseau avec la possibilité de latence, erreurs et timeouts
 * @param operation La fonction qui représente l'opération réseau
 * @param errorMessage Le message d'erreur à afficher en cas d'erreur simulée
 */
export const simulateNetwork = async <T>(
  operation: () => Promise<T> | T,
  errorMessage: string = "Network error"
): Promise<T> => {
  // Si la simulation est désactivée, exécuter l'opération directement
  if (!config.enabled) {
    return operation();
  }
  
  return new Promise<T>((resolve, reject) => {
    // Calculer le délai si la latence est activée
    const delay = config.latency.enabled
      ? Math.floor(Math.random() * (config.latency.maxMs - config.latency.minMs) + config.latency.minMs)
      : 0;
    
    // Décider si on simule une erreur
    const shouldFail = config.errors.enabled && Math.random() < config.errors.probability;
    
    // Décider si on simule un timeout
    const shouldTimeout = config.timeout.enabled && Math.random() < config.timeout.probability;
    
    setTimeout(() => {
      // Simulation d'une erreur
      if (shouldFail) {
        console.log(`[Network Simulator] Simulating error: ${errorMessage}`);
        reject(new Error(errorMessage));
        return;
      }
      
      try {
        // Exécution normale
        const result = operation();
        if (result instanceof Promise) {
          result.then(resolve).catch(reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    }, delay);
    
    // Simulation d'un timeout
    if (shouldTimeout) {
      setTimeout(() => {
        console.log(`[Network Simulator] Simulating timeout after ${config.timeout.timeoutMs}ms`);
        reject(new Error("Request timed out"));
      }, config.timeout.timeoutMs);
    }
  });
};

/**
 * Configure le simulateur de réseau
 */
export const configureNetworkSimulator = (newConfig: Partial<typeof config>) => {
  config = {
    ...config,
    ...newConfig,
    latency: {
      ...config.latency,
      ...newConfig.latency
    },
    errors: {
      ...config.errors,
      ...newConfig.errors
    },
    timeout: {
      ...config.timeout,
      ...newConfig.timeout
    }
  };
  
  console.log('[Network Simulator] Configuration updated:', config);
  return config;
};

/**
 * Active ou désactive la simulation réseau
 */
export const toggleNetworkSimulation = (enabled: boolean) => {
  config.enabled = enabled;
  console.log(`[Network Simulator] ${enabled ? 'Enabled' : 'Disabled'}`);
  return config;
};

/**
 * Retourne la configuration actuelle
 */
export const getNetworkSimulatorConfig = () => {
  return { ...config };
};

// Exportation de l'interface de configuration pour la réutiliser ailleurs
export type NetworkSimulatorConfig = typeof config;
