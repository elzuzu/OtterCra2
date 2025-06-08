// ottercra/src/types.ts

// Fichier original non fourni, je crée les types nécessaires.

/**
 * Représente les différents états de validation d'une clé API.
 * - idle: Aucun test en cours.
 * - validating: Le format est en cours de vérification ou un test de connectivité est actif.
 * - success: La clé est valide et la connexion a réussi.
 * - error: Le format est invalide ou la connexion a échoué.
 * - format_invalid: Le format de la clé ne correspond pas au regex.
 */
export type ApiKeyStatus = 'idle' | 'validating' | 'success' | 'error' | 'format_invalid';

/**
 * Détails du résultat d'un test de connectivité.
 */
export interface ApiKeyValidationResult {
  status: ApiKeyStatus;
  message: string;
}

/**
 * Profil d'un fournisseur LLM tel que défini dans les constantes.
 */
export interface LlmProviderProfile {
  provider: string;
  priority: number;
  recommended: boolean;
  reason: string;
  signup_url: string;
  api_key_help: string;
  test_model: string;
  format_regex: RegExp;
}

/**
 * Structure de la configuration des fournisseurs LLM.
 */
export interface LlmProviderConfig {
  apiKey: string;
  status: ApiKeyStatus;
  lastValidated?: string;
  error?: string;
}

export interface LlmConfig {
  [provider: string]: LlmProviderConfig;
}

/**
 * Représente la configuration complète de l'application.
 */
export interface AppConfig {
  userProfile: {
    username: string;
    email: string;
    trigram: string;
  };
  llmConfig: LlmConfig;
  dataSources: {
    outlookAccount: string;
    excelFolder: string;
    craBasePath: string;
  };
  setupFlags: {
    firstLaunchCompleted: boolean;
    llmProvidersConfigured: boolean;
    dataSourcesConfigured: boolean;
    connectivityValidated: boolean;
  };
}
