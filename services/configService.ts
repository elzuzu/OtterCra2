
import { AppConfig, initialAppConfig } from '../types';
import { CONFIG_STORAGE_KEY } from '../constants';

export const loadConfig = (): AppConfig => {
  try {
    const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig) as AppConfig;
      // Merge with initialAppConfig to ensure all fields are present, 
      // especially if new fields were added to initialAppConfig later.
      return {
        ...initialAppConfig,
        ...parsedConfig,
        userProfile: { ...initialAppConfig.userProfile, ...parsedConfig.userProfile },
        llmConfig: {
          ...initialAppConfig.llmConfig,
          ...parsedConfig.llmConfig,
          providers: {
            groq: { ...initialAppConfig.llmConfig.providers.groq, ...parsedConfig.llmConfig?.providers?.groq },
            gemini: { ...initialAppConfig.llmConfig.providers.gemini, ...parsedConfig.llmConfig?.providers?.gemini },
            openai_compatible: { ...initialAppConfig.llmConfig.providers.openai_compatible, ...parsedConfig.llmConfig?.providers?.openai_compatible },
          }
        },
        dataSources: { ...initialAppConfig.dataSources, ...parsedConfig.dataSources },
        setupFlags: { ...initialAppConfig.setupFlags, ...parsedConfig.setupFlags },
      };
    }
  } catch (error) {
    console.error("Error loading config from localStorage:", error);
  }
  return { ...initialAppConfig }; // Return a new copy to avoid direct mutation
};

export const saveConfig = (config: AppConfig): void => {
  try {
    const configToSave = { ...config };
    // Potentially encrypt sensitive fields like API keys before saving
    // For this example, we save them as is.
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configToSave));
  } catch (error) {
    console.error("Error saving config to localStorage:", error);
  }
};

export const isSetupCompleted = (): boolean => {
  const config = loadConfig();
  return config.setupFlags.firstLaunchCompleted && 
         config.setupFlags.llmProvidersConfigured && // LLM is crucial
         config.setupFlags.connectivityValidated;
};

export const clearConfig = (): void => {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing config from localStorage:", error);
  }
}
