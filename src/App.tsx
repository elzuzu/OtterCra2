
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SetupWizard from './components/SetupWizard';
import { loadConfig, saveConfig, isSetupCompleted as checkSetupCompleted, clearConfig } from './services/configService';
import { AppConfig, initialAppConfig, ConfigContextType, LlmProviderApiKeyInfo } from './types';
import HealthDashboard from './components/HealthDashboard'; // Placeholder for post-setup screen

export const ConfigContext = React.createContext<ConfigContextType | undefined>(undefined);

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(loadConfig());
  const [setupComplete, setSetupComplete] = useState<boolean>(checkSetupCompleted());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const currentConfig = loadConfig();
    setConfig(currentConfig);
    setSetupComplete(checkSetupCompleted());
    setIsLoading(false);
  }, []);
  
  const updateConfigStateAndSave = useCallback((newConfigData: Partial<AppConfig> | ((prevConfig: AppConfig) => AppConfig)) => {
    setConfig(prev => {
      const updatedConfig = typeof newConfigData === 'function' ? newConfigData(prev) : { ...prev, ...newConfigData };
      saveConfig(updatedConfig);
      // Check if setup is now complete based on the new config state
      if (
        updatedConfig.setupFlags.firstLaunchCompleted &&
        updatedConfig.setupFlags.llmProvidersConfigured &&
        updatedConfig.setupFlags.connectivityValidated
      ) {
        setSetupComplete(true);
      }
      return updatedConfig;
    });
  }, []);


  const updateLlmProviderKey = useCallback((providerId: keyof AppConfig['llmConfig']['providers'], key: string) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        llmConfig: {
          ...prev.llmConfig,
          providers: {
            ...prev.llmConfig.providers,
            [providerId]: {
              ...prev.llmConfig.providers[providerId],
              apiKeyInfo: {
                ...prev.llmConfig.providers[providerId].apiKeyInfo,
                key: key,
                status: 'pending', // Reset status on key change
                message: ''
              },
            },
          },
        },
      };
      saveConfig(newConfig);
      return newConfig;
    });
  }, []);

  const updateLlmProviderStatus = useCallback((
    providerId: keyof AppConfig['llmConfig']['providers'],
    status: LlmProviderApiKeyInfo['status'],
    message: string,
    quotaInfo?: string
  ) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        llmConfig: {
          ...prev.llmConfig,
          providers: {
            ...prev.llmConfig.providers,
            [providerId]: {
              ...prev.llmConfig.providers[providerId],
              apiKeyInfo: {
                ...prev.llmConfig.providers[providerId].apiKeyInfo,
                status: status,
                message: message,
                quotaInfo: quotaInfo || prev.llmConfig.providers[providerId].apiKeyInfo.quotaInfo,
                lastValidated: status === 'valid' ? new Date().toISOString() : prev.llmConfig.providers[providerId].apiKeyInfo.lastValidated,
              },
               isConfigured: status === 'valid' ? true : prev.llmConfig.providers[providerId].isConfigured,
            },
          },
        },
      };
      saveConfig(newConfig);
      return newConfig;
    });
  }, []);

  const setLlmProviderConfigured = useCallback((providerId: keyof AppConfig['llmConfig']['providers'], isConfigured: boolean) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        llmConfig: {
          ...prev.llmConfig,
          providers: {
            ...prev.llmConfig.providers,
            [providerId]: {
              ...prev.llmConfig.providers[providerId],
              isConfigured: isConfigured,
            },
          },
        },
      };
      saveConfig(newConfig);
      return newConfig;
    });
  }, []);

  const contextValue = useMemo<ConfigContextType>(() => ({
    config,
    updateConfig: updateConfigStateAndSave,
    updateLlmProviderKey,
    updateLlmProviderStatus,
    setLlmProviderConfigured,
  }), [config, updateConfigStateAndSave, updateLlmProviderKey, updateLlmProviderStatus, setLlmProviderConfigured]);


  const handleResetSetup = () => {
    clearConfig();
    setConfig(initialAppConfig);
    setSetupComplete(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-slate-700">Chargement...</div>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={contextValue}>
      <div className="min-h-screen text-slate-800">
        {!setupComplete ? (
          <SetupWizard onSetupComplete={() => setSetupComplete(true)} />
        ) : (
          <HealthDashboard onResetSetup={handleResetSetup} />
        )}
      </div>
    </ConfigContext.Provider>
  );
};

export default App;