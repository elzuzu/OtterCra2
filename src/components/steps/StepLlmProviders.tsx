import React, { useContext, useState, useEffect } from 'react';
import ApiKeyInput from '../ApiKeyInput';
import { LLM_PROVIDERS_DETAILS } from '../../constants';
import { ConfigContext } from '../../App';
import { CpuChipIconSolid, PlusCircleIcon } from '../icons'; 
import { LlmProviderId } from '../../types';

const StepLlmProviders: React.FC = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("ConfigContext not found");
  
  const { config, updateConfig } = context;
  
  const [atLeastOneProviderValid, setAtLeastOneProviderValid] = useState(false);
  const [activeInputProviderIds, setActiveInputProviderIds] = useState<Set<LlmProviderId>>(new Set());

  useEffect(() => {
    const initialActiveIds = new Set<LlmProviderId>();
    (Object.keys(LLM_PROVIDERS_DETAILS) as LlmProviderId[]).forEach(id => {
        const providerConf = config.llmConfig.providers[id];
        if (providerConf.apiKeyInfo.key || providerConf.isConfigured || ['error', 'invalid'].includes(providerConf.apiKeyInfo.status)) {
            initialActiveIds.add(id);
        }
    });
    setActiveInputProviderIds(initialActiveIds);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    setActiveInputProviderIds(currentActiveIds => {
        const newActiveIds = new Set(currentActiveIds);
        let changed = false;
        currentActiveIds.forEach(id => {
            const providerConf = config.llmConfig.providers[id];
            if (providerConf.apiKeyInfo.key === '' && providerConf.apiKeyInfo.status === 'pending' && !providerConf.isConfigured) {
                newActiveIds.delete(id);
                changed = true;
            }
        });
        return changed ? newActiveIds : currentActiveIds;
    });
  }, [config.llmConfig.providers]);


  useEffect(() => {
    const isValid = Object.values(config.llmConfig.providers).some(p => p.isConfigured && p.apiKeyInfo.status === 'valid');
    setAtLeastOneProviderValid(isValid);
    if (isValid !== config.setupFlags.llmProvidersConfigured) { 
        updateConfig(prev => ({
            ...prev,
            setupFlags: { ...prev.setupFlags, llmProvidersConfigured: isValid }
        }));
    }
  }, [config.llmConfig.providers, updateConfig, config.setupFlags.llmProvidersConfigured]);

  const handleAddProviderInput = (providerId: LlmProviderId) => {
    setActiveInputProviderIds(prev => new Set(prev).add(providerId));
  };

  const providerOrder = Object.keys(LLM_PROVIDERS_DETAILS) as LlmProviderId[];

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-center mb-4">
          <CpuChipIconSolid className="w-12 h-12 text-blue-500 mr-3"/>
          <h2 className="text-2xl font-semibold text-slate-700">Configuration des APIs LLM</h2>
      </div>
      <p className="text-sm text-slate-600 mb-2 text-center">
        OtterCra a besoin d'au moins une API LLM pour fonctionner. Ajoutez les fournisseurs que vous souhaitez utiliser.
      </p>
      <p className="text-xs text-slate-500 mb-6 text-center">
        Nous recommandons Groq (rapide et gratuit) et Gemini (quota généreux) pour une meilleure redondance.
      </p>
      
      <div className="space-y-6">
        {providerOrder.map(providerId => {
          const providerDetails = LLM_PROVIDERS_DETAILS[providerId];
          const providerConfig = config.llmConfig.providers[providerId];
          const isInputActive = activeInputProviderIds.has(providerId);
          const showInput = isInputActive || providerConfig.apiKeyInfo.key || providerConfig.isConfigured || ['error', 'invalid'].includes(providerConfig.apiKeyInfo.status);

          return (
            <div key={providerId} className="p-1 rounded-lg_ bg-white_">
              {!showInput ? (
                <div className="p-4 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-slate-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-md font-semibold text-slate-700">{providerDetails.name}</h3>
                            {providerDetails.recommended && (
                                <span className="text-xs bg-green-100 text-green-700 font-medium px-1.5 py-0.5 rounded-full mr-2 my-1 inline-block">Recommandé</span>
                            )}
                            <p className="text-xs text-slate-500">{providerDetails.reason}</p>
                        </div>
                        <button
                        onClick={() => handleAddProviderInput(providerId)}
                        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white text-xs font-semibold rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                        aria-label={`Ajouter la clé API pour ${providerDetails.name}`}
                        >
                        <PlusCircleIcon className="w-4 h-4 mr-1.5" />
                        Ajouter Clé API
                        </button>
                    </div>
                </div>

              ) : (
                <ApiKeyInput providerId={providerId} />
              )}
            </div>
          );
        })}
      </div>
      
      {!atLeastOneProviderValid && (
        <div className="mt-8 p-3.5 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-700 text-center shadow">
          Veuillez configurer et valider au moins une API LLM pour continuer.
        </div>
      )}
       <div className="mt-8 p-4 bg-sky-50 border border-sky-200 rounded-lg text-sm text-sky-700 shadow-sm">
        <h4 className="font-semibold mb-2">Pourquoi plusieurs APIs ?</h4>
        <p className="mb-1">Utiliser plusieurs fournisseurs d'API LLM offre :</p>
        <ul className="list-disc list-inside ml-4 text-xs space-y-0.5">
            <li><strong>Redondance :</strong> Si un service est en panne ou atteint ses limites de quota, OtterCra peut basculer automatiquement vers un autre.</li>
            <li><strong>Optimisation des coûts/performances :</strong> Permet de choisir le meilleur modèle pour différentes tâches (non implémenté dans cette version de base).</li>
        </ul>
        <p className="mt-2.5 text-xs">Vos clés API sont stockées localement dans votre navigateur et ne sont pas envoyées à nos serveurs.</p>
      </div>
    </div>
  );
};

export default StepLlmProviders;
