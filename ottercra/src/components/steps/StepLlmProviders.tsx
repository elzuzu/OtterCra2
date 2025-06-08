// ottercra/src/components/steps/StepLlmProviders.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { ApiKeyInput } from '../ApiKeyInput';
import { LlmConfig, ApiKeyValidationResult, LlmProviderProfile, ApiKeyStatus } from '../../types';

// Ces constantes devraient être dans un fichier centralisé comme `src/constants.ts`
// Pour l'instant, je les laisse ici comme dans l'issue.
const LLM_PROVIDERS: LlmProviderProfile[] = [
  {
    provider: 'groq',
    priority: 1,
    recommended: true,
    reason: "Gratuit, très rapide, modèles performants",
    signup_url: "https://console.groq.com/keys",
    api_key_help: "Obtenez votre clé sur la console Groq.",
    test_model: "llama3-8b-8192",
    format_regex: /^gsk_[a-zA-Z0-9]{48}$/
  },
  {
    provider: 'gemini',
    priority: 2,
    recommended: true,
    reason: "Gratuit avec quota généreux",
    signup_url: "https://aistudio.google.com/app/apikey",
    api_key_help: "Obtenez votre clé depuis Google AI Studio.",
    test_model: "gemini-1.5-flash",
    format_regex: /^AIza[a-zA-Z0-9_-]{35}$/
  }
];

interface StepLlmProvidersProps {
  onUpdate: (config: LlmConfig, isConfigurationValid: boolean) => void;
  initialConfig: LlmConfig;
}

export const StepLlmProviders: React.FC<StepLlmProvidersProps> = ({ onUpdate, initialConfig }) => {
  // Initialize state with initialConfig or default empty state for each provider
  const [llmConfig, setLlmConfig] = useState<LlmConfig>(() => {
    const initialProviders = LLM_PROVIDERS.reduce((acc, providerProfile) => {
      acc[providerProfile.provider] = {
        apiKey: '',
        status: 'idle' as ApiKeyStatus,
        ...initialConfig[providerProfile.provider] // Spread any existing initial config for this provider
      };
      return acc;
    }, {} as LlmConfig);
    return { ...initialProviders, ...initialConfig };
  });

  const [isAtLeastOneProviderValid, setIsAtLeastOneProviderValid] = useState(false);

  // Recalculate isAtLeastOneProviderValid and call onUpdate whenever llmConfig changes.
  // Wrapped onUpdate with useCallback to stabilize its reference if passed down.
  const memoizedOnUpdate = useCallback(onUpdate, []);

  useEffect(() => {
    const hasValidProvider = Object.values(llmConfig).some(p => p.status === 'success');
    setIsAtLeastOneProviderValid(hasValidProvider);
    memoizedOnUpdate(llmConfig, hasValidProvider);
  }, [llmConfig, memoizedOnUpdate]);

  const handleApiKeyChange = (provider: string, apiKey: string) => {
    setLlmConfig(prev => {
      const newConfig = {
        ...prev,
        [provider]: {
          ...(prev[provider] || { apiKey: '', status: 'idle' }), // Ensure provider entry exists
          apiKey: apiKey,
          // If API key is being cleared, reset status to idle.
          // Otherwise, keep current status or set to idle if it was a final state.
          status: apiKey ? (prev[provider]?.status === 'success' || prev[provider]?.status === 'error' || prev[provider]?.status === 'format_invalid' ? 'idle' : prev[provider]?.status || 'idle') : 'idle'
        },
      };
      return newConfig;
    });
  };

  const handleValidationComplete = (provider: string, result: ApiKeyValidationResult) => {
    setLlmConfig(prev => {
       const newConfig = {
        ...prev,
        [provider]: {
          ...(prev[provider] || { apiKey: '', status: 'idle' }), // Ensure provider entry exists
          apiKey: prev[provider]?.apiKey || '', // Keep current API key
          status: result.status,
          error: result.status === 'error' || result.status === 'format_invalid' ? result.message : undefined,
          lastValidated: result.status === 'success' ? new Date().toISOString() : prev[provider]?.lastValidated,
        },
      };
      return newConfig;
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white">Étape 3: Configuration des APIs LLM</h2>
      <p className="mt-2 text-sm text-gray-400">
        OtterCra a besoin d'au moins une clé API pour fonctionner. Nous recommandons Groq pour sa vitesse et sa gratuité.
      </p>

      <div className="mt-6 space-y-8">
        {LLM_PROVIDERS.map(profile => (
          <div key={profile.provider} className="p-4 border border-white/10 rounded-lg">
             <ApiKeyInput
                providerName={profile.provider}
                providerProfile={profile}
                value={llmConfig[profile.provider]?.apiKey || ''}
                onChange={(apiKey) => handleApiKeyChange(profile.provider, apiKey)}
                onValidationComplete={(result) => handleValidationComplete(profile.provider, result)}
              />
          </div>
        ))}
      </div>

      {!isAtLeastOneProviderValid && (
        <div className="mt-6 p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm rounded-md">
            Veuillez configurer et valider au moins une clé API pour pouvoir continuer.
        </div>
      )}
    </div>
  );
};
