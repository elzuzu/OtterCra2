
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ConfigContext } from '../../App';
import { testApiKeyConnectivity } from '../../services/llmService';
import { LLM_PROVIDERS_DETAILS } from '../../constants';
import { ApiProviderDetail, LlmProviderId, TestItem, TestResultStatus } from '../../types';
import { ArrowPathIcon, CheckIcon, InformationCircleIcon, ServerStackIconSolid, XCircleIcon, FolderOpenIcon, EnvelopeIcon } from '../icons'; // Added FolderOpenIcon, EnvelopeIcon

const StepTestConnectivity: React.FC = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("ConfigContext not found");
  
  const { config, updateConfig } = context;
  const [testResults, setTestResults] = useState<TestItem[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [overallLlmStatus, setOverallLlmStatus] = useState<TestResultStatus>('pending');

  const configuredLlmProviders = Object.entries(config.llmConfig.providers)
    .filter(([, providerConfig]) => providerConfig.isConfigured && providerConfig.apiKeyInfo.key && providerConfig.apiKeyInfo.status === 'valid')
    .map(([id, providerConfig]) => ({
      id: id as LlmProviderId,
      name: (LLM_PROVIDERS_DETAILS[id as LlmProviderId] as ApiProviderDetail).name,
      apiKey: providerConfig.apiKeyInfo.key,
    }));

  const configuredDataSources = [
    { id: 'outlook', name: 'Connexion Outlook', path: config.dataSources.outlookAccount, condition: !!config.dataSources.outlookAccount, message: "Vérification manuelle requise. Assurez-vous qu'Outlook est installé et accessible. Le navigateur ne peut pas tester cela directement." },
    { id: 'excelFolder', name: 'Accès Dossier Excel', path: config.dataSources.excelFolder, condition: !!config.dataSources.excelFolder, message: `Vérification manuelle requise pour le chemin: ${config.dataSources.excelFolder || 'Non configuré'}. Le navigateur ne peut pas vérifier l'existence de ce dossier.` },
    { id: 'craBasePath', name: 'Accès Chemin CRA', path: config.dataSources.craBasePath, condition: !!config.dataSources.craBasePath, message: `Vérification manuelle requise pour le chemin: ${config.dataSources.craBasePath || 'Non configuré'}. Le navigateur ne peut pas vérifier l'existence de ce dossier.` },
  ].filter(ds => ds.condition);

  const runAllTests = useCallback(async () => {
    setIsTestingAll(true);
    setOverallLlmStatus('pending');
    
    let initialResults: TestItem[] = [];
    
    // Initial state for LLM tests
    if (configuredLlmProviders.length > 0) {
        initialResults = initialResults.concat(configuredLlmProviders.map(p => ({
            id: p.id,
            name: p.name,
            status: 'testing' as TestResultStatus,
            message: 'Test en cours...',
            type: 'llm' as 'llm',
        })));
    } else {
        initialResults.push({ id: 'llm_placeholder', name: "Fournisseurs LLM", status: 'info', message: "Aucun fournisseur LLM n'a été configuré et validé à l'étape précédente. Veuillez retourner à l'étape des LLMs.", type: 'llm'});
    }

    // Initial state for Data Source tests (simulated)
    initialResults = initialResults.concat(configuredDataSources.map(ds => ({
        id: ds.id,
        name: ds.name,
        status: 'info' as TestResultStatus,
        message: ds.message,
        type: 'dataSource' as 'dataSource',
    })));
     if (config.setupFlags.dataSourcesConfigured && configuredDataSources.length === 0) {
        initialResults.push({ id: 'dataSource_placeholder', name: "Sources de données", status: 'info', message: "Aucune source de données spécifique n'a été renseignée (étape optionnelle).", type: 'dataSource'});
    }


    setTestResults(initialResults);

    let allLlmSuccessful = configuredLlmProviders.length > 0; // Assume true if providers exist, else false.

    if (configuredLlmProviders.length > 0) {
        const llmTestPromises = configuredLlmProviders.map(async (provider) => {
            const result = await testApiKeyConnectivity(provider.id, provider.apiKey);
            if (!result.success) {
                allLlmSuccessful = false;
            }
            return {
                id: provider.id,
                name: provider.name,
                status: result.success ? 'success' : 'failed',
                message: result.message,
                type: 'llm',
            } as TestItem;
        });
        const llmResults = await Promise.all(llmTestPromises);
         setTestResults(prevResults => [
            ...llmResults,
            ...prevResults.filter(r => r.type === 'dataSource' || r.id === 'llm_placeholder' || r.id === 'dataSource_placeholder') // Keep placeholder if it exists
        ]);

    } else {
        allLlmSuccessful = false; // No LLMs configured means LLM part is not successful for proceeding
    }
    
    setIsTestingAll(false);
    setOverallLlmStatus(allLlmSuccessful ? 'success' : 'failed');

    updateConfig(prev => ({
        ...prev,
        setupFlags: { ...prev.setupFlags, connectivityValidated: allLlmSuccessful }
    }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(configuredLlmProviders.map(p => p.id)), 
    updateConfig,
    JSON.stringify(configuredDataSources.map(ds => ds.id + ds.path)),
    config.setupFlags.dataSourcesConfigured
  ]);

  useEffect(() => {
    runAllTests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const getStatusIcon = (status: TestResultStatus, type: 'llm' | 'dataSource', itemName: string) => {
    if (status === 'testing') return <ArrowPathIcon className="text-blue-500" />;
    if (status === 'success') return <CheckIcon className="text-green-500" />;
    if (status === 'failed') return <XCircleIcon className="text-red-500" />;
    if (status === 'info') {
        if (type === 'dataSource') {
            const lowerCaseName = itemName.toLowerCase();
            if (lowerCaseName.includes("outlook")) return <EnvelopeIcon className="text-sky-500" />;
            if (lowerCaseName.includes("dossier") || lowerCaseName.includes("chemin")) return <FolderOpenIcon className="text-sky-500" />;
        }
        return <InformationCircleIcon className="text-sky-500" />;
    }
    return null;
  };
  
  const llmTests = testResults.filter(r => r.type === 'llm');
  const dataSourceTests = testResults.filter(r => r.type === 'dataSource');

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <ServerStackIconSolid className="w-12 h-12 text-blue-500 mr-3"/>
        <h2 className="text-2xl font-semibold text-slate-700">Test de Connectivité Final</h2>
      </div>
      <p className="text-sm text-slate-600 mb-3 text-center">
        Nous vérifions la connectivité des fournisseurs LLM et rappelons les vérifications manuelles pour les sources de données.
      </p>

      { (isTestingAll || llmTests.length > 0 ) && (
        <>
            <h3 className="text-md font-semibold text-slate-700 mt-6 mb-2">Fournisseurs LLM :</h3>
            {llmTests.length === 0 && isTestingAll && <p className="text-sm text-slate-500">Test en cours...</p>}
            {llmTests.length > 0 && (
                <div className="space-y-3 mb-6">
                {llmTests.map(result => (
                    <div key={result.id} className={`p-3 rounded-md border flex items-start space-x-3 shadow-sm ${
                    result.status === 'success' ? 'bg-green-50 border-green-200' : 
                    result.status === 'failed' ? 'bg-red-50 border-red-200' : 
                    result.status === 'testing' ? 'bg-blue-50 border-blue-200' :
                    'bg-sky-50 border-sky-200' // For 'info'
                    }`}>
                    <div className="flex-shrink-0 pt-1">{getStatusIcon(result.status, result.type, result.name)}</div>
                    <div>
                        <h4 className={`font-semibold ${
                            result.status === 'success' ? 'text-green-700' : 
                            result.status === 'failed' ? 'text-red-700' : 
                            result.status === 'testing' ? 'text-blue-700' :
                            'text-sky-700' // For 'info'
                        }`}>{result.name}</h4>
                        <p className={`text-xs ${
                            result.status === 'success' ? 'text-green-600' : 
                            result.status === 'failed' ? 'text-red-600' : 
                            result.status === 'testing' ? 'text-blue-600' :
                            'text-sky-600' // For 'info'
                        }`}>{result.message}</p>
                    </div>
                    </div>
                ))}
                </div>
            )}
        </>
      )}

      { (config.setupFlags.dataSourcesConfigured || dataSourceTests.length > 0) && (
        <>
            <h3 className="text-md font-semibold text-slate-700 mt-6 mb-2">Sources de Données (Vérification Manuelle) :</h3>
            {dataSourceTests.length === 0 && isTestingAll && <p className="text-sm text-slate-500">Chargement...</p>}
            {dataSourceTests.length > 0 && (
                <div className="space-y-3 mb-6">
                {dataSourceTests.map(result => (
                     <div key={result.id} className="p-3 rounded-md border flex items-start space-x-3 shadow-sm bg-sky-50 border-sky-200">
                        <div className="flex-shrink-0 pt-1">{getStatusIcon(result.status, result.type, result.name)}</div>
                        <div>
                            <h4 className="font-semibold text-sky-700">{result.name}</h4>
                            <p className="text-xs text-sky-600">{result.message}</p>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </>
      )}


      <div className="text-center mt-6">
        <button
            onClick={runAllTests}
            disabled={isTestingAll}
            className={`px-6 py-2.5 text-sm font-medium rounded-md shadow-sm transition-colors ${
            isTestingAll
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
        >
            {isTestingAll ? 'Tests en cours...' : 'Relancer Tous les Tests'}
        </button>
      </div>

      {overallLlmStatus === 'success' && !isTestingAll && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-md text-green-700 text-center">
          <h3 className="font-semibold text-lg">🎉 Tests LLM réussis !</h3>
          <p className="text-sm">Au moins un fournisseur LLM est opérationnel. Vous pouvez passer à l'étape suivante.</p>
        </div>
      )}
      {overallLlmStatus === 'failed' && !isTestingAll && configuredLlmProviders.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-md text-red-700 text-center">
           <h3 className="font-semibold text-lg">⚠️ Certains tests LLM ont échoué.</h3>
           <p className="text-sm">Veuillez vérifier les messages d'erreur des fournisseurs LLM et vos configurations de clés API à l'étape précédente, puis relancez les tests.</p>
        </div>
      )}
       {overallLlmStatus === 'failed' && !isTestingAll && configuredLlmProviders.length === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-700 text-center">
           <h3 className="font-semibold text-lg">ℹ️ Configuration LLM requise.</h3>
           <p className="text-sm">Aucun fournisseur LLM n'est actuellement configuré ou valide. Veuillez configurer au moins un fournisseur LLM pour continuer.</p>
        </div>
      )}
    </div>
  );
};

export default StepTestConnectivity;
