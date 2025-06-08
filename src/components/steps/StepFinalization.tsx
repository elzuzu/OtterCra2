import React, { useContext, useEffect } from 'react';
import { ConfigContext } from '../../App';
import { FlagIconSolid, CheckIcon } from '../icons';
import { LLM_PROVIDERS_DETAILS } from '../../constants';
import { LlmProviderId } from '../../types';


const StepFinalization: React.FC = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("ConfigContext not found");

  const { config, updateConfig } = context;

  useEffect(() => {
    if(!config.setupFlags.firstLaunchCompleted) {
        updateConfig(prev => ({
        ...prev,
        setupFlags: {
            ...prev.setupFlags,
            firstLaunchCompleted: true, 
            llmProvidersConfigured: Object.values(prev.llmConfig.providers).some(p => p.isConfigured && p.apiKeyInfo.status === 'valid'),
            connectivityValidated: prev.setupFlags.connectivityValidated 
        },
        userProfile: {
            ...prev.userProfile,
            setupCompleted: new Date().toISOString(),
            setupVersion: "1.0"
        }
        }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const configuredLlmProviders = Object.entries(config.llmConfig.providers)
    .filter(([, provider]) => provider.isConfigured && provider.apiKeyInfo.status === 'valid')
    .map(([id]) => LLM_PROVIDERS_DETAILS[id as LlmProviderId].name);

  const dataSourcesSummary = [
    config.dataSources.outlookAccount && `Compte Outlook: ${config.dataSources.outlookAccount}`,
    config.dataSources.excelFolder && `Dossier Excel: ${config.dataSources.excelFolder}`,
    config.dataSources.craBasePath && `Chemin CRAs: ${config.dataSources.craBasePath}`,
  ].filter(Boolean);


  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="flex items-center justify-center mb-6">
        <FlagIconSolid className="w-16 h-16 text-green-500 mr-3"/>
        <h2 className="text-3xl font-bold text-slate-800">Configuration Terminée !</h2>
      </div>
      
      <p className="text-slate-600 mb-8">
        OtterCra est maintenant configuré et prêt à vous aider à automatiser vos Comptes Rendus d'Activité.
      </p>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg text-left shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Résumé de la Configuration :</h3>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            Profil utilisateur (<span className="font-medium">{config.userProfile.username || 'N/A'}</span>) configuré.
          </li>
          <li className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            {configuredLlmProviders.length > 0 
              ? `Fournisseurs LLM actifs : ${configuredLlmProviders.join(', ')}.`
              : "Aucun fournisseur LLM configuré."
            }
          </li>
          <li className="flex items-start">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
            {dataSourcesSummary.length > 0 
              ? (
                <>
                Sources de données connectées :
                <ul className="list-disc list-inside ml-4 mt-1 text-xs">
                    {dataSourcesSummary.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
                </>
              )
              : "Sources de données optionnelles non configurées (ou ignorées)."
            }
            </div>
          </li>
          <li className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            Connectivité des services LLM validée.
          </li>
        </ul>
      </div>

      <p className="text-xs text-slate-500">
        La configuration a été sauvegardée localement dans votre navigateur.
      </p>
      <p className="mt-6 text-sm text-slate-700 font-semibold">
        Cliquez sur "Terminer le Setup" pour commencer à utiliser OtterCra.
      </p>
    </div>
  );
};

export default StepFinalization;
