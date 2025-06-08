
import React, { useContext } from 'react';
import { ConfigContext } from '../App';
import { LLM_PROVIDERS_DETAILS } from '../constants';
import { CheckIcon, SparklesIcon, XCircleIcon } from './icons';
import { LlmProviderId } from '../types';

interface HealthDashboardProps {
  onResetSetup: () => void;
}

const HealthDashboard: React.FC<HealthDashboardProps> = ({ onResetSetup }) => {
  const context = useContext(ConfigContext);
  if (!context) {
    return <div className="p-8 text-red-500">Erreur: Contexte de configuration non disponible.</div>;
  }
  const { config } = context;

  const getProviderStatus = (providerId: LlmProviderId) => {
    const provider = config.llmConfig.providers[providerId];
    if (!provider.isConfigured) return { status: 'non configuré', color: 'text-slate-500', icon: <XCircleIcon className="w-4 h-4" /> };
    if (provider.apiKeyInfo.status === 'valid') return { status: 'opérationnel', color: 'text-green-500', icon: <CheckIcon className="w-4 h-4" /> };
    if (provider.apiKeyInfo.status === 'error' || provider.apiKeyInfo.status === 'invalid') return { status: 'erreur', color: 'text-red-500', icon: <XCircleIcon className="w-4 h-4" /> };
    return { status: 'inconnu', color: 'text-yellow-500', icon: <XCircleIcon className="w-4 h-4" /> };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-sky-100 p-6">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-2xl text-center">
        <SparklesIcon className="w-20 h-20 text-blue-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-slate-800 mb-4">OtterCra est Prêt !</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Votre configuration est terminée. Vous pouvez maintenant commencer à générer vos CRAs.
        </p>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg text-left shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">État des Services LLM :</h2>
            <ul className="space-y-3">
                {(Object.keys(config.llmConfig.providers) as LlmProviderId[]).map(providerId => {
                    const providerDetails = LLM_PROVIDERS_DETAILS[providerId];
                    if (!providerDetails) return null; 
                    
                    const { status, color, icon } = getProviderStatus(providerId);
                    const apiKeyInfo = config.llmConfig.providers[providerId].apiKeyInfo;

                    return (
                        <li key={providerId} className="p-3 border border-slate-200 rounded-md bg-white hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-700">{providerDetails.name}</span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                                    status === 'opérationnel' ? 'bg-green-100 text-green-700' :
                                    status === 'erreur' ? 'bg-red-100 text-red-700' :
                                    status === 'non configuré' ? 'bg-slate-100 text-slate-600' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                            </div>
                            {config.llmConfig.providers[providerId].isConfigured && apiKeyInfo.status !== 'valid' && apiKeyInfo.message && (
                                <p className="text-xs text-red-500 mt-1">Détail: {apiKeyInfo.message}</p>
                            )}
                             {config.llmConfig.providers[providerId].isConfigured && apiKeyInfo.status === 'valid' && apiKeyInfo.quotaInfo && (
                                <p className="text-xs text-slate-500 mt-1">Info Quota: {apiKeyInfo.quotaInfo}</p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
        
        <p className="text-sm text-slate-500 mb-4">
          Ceci est une page de démonstration. L'application principale avec la génération de CRA n'est pas incluse dans ce setup.
        </p>
        <button
          onClick={onResetSetup}
          className="px-6 py-2.5 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:ring-4 focus:ring-red-300 transition-all duration-150 text-sm"
        >
          Réinitialiser la Configuration (pour démo)
        </button>
      </div>
      <p className="mt-8 text-xs text-slate-500">OtterCra &copy; {new Date().getFullYear()}</p>
    </div>
  );
};

export default HealthDashboard;
