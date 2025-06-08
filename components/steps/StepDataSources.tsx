
import React, { useContext } from 'react';
import { ConfigContext } from '../../App';
import { CircleStackIconSolid } from '../icons';


const StepDataSources: React.FC = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("ConfigContext not found");

  const { config, updateConfig } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateConfig(prevConfig => {
        const newDataSources = {
            ...prevConfig.dataSources,
            [name]: value,
        };
        const allOptionalFieldsFilled = newDataSources.outlookAccount && newDataSources.excelFolder && newDataSources.craBasePath;
        return {
            ...prevConfig,
            dataSources: newDataSources,
            setupFlags: {
                ...prevConfig.setupFlags,
                // Mark as configured if any field is filled, or rely on skip
                dataSourcesConfigured: prevConfig.setupFlags.dataSourcesConfigured || Object.values(newDataSources).some(v => v !== '')
            }
        };
    });
  };

  return (
    <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-6">
            <CircleStackIconSolid className="w-12 h-12 text-blue-500 mr-3"/>
            <h2 className="text-2xl font-semibold text-slate-700">Sources de Données (Optionnel)</h2>
        </div>
      <p className="text-sm text-slate-600 mb-6 text-center">
        Connectez vos sources de données pour qu'OtterCra puisse collecter automatiquement les informations pour vos CRAs.
        Vous pourrez configurer cela plus tard si vous le souhaitez.
      </p>
      <form className="space-y-6">
        <div>
          <label htmlFor="outlookAccount" className="block text-sm font-medium text-slate-700 mb-1">
            Compte Outlook (Email)
          </label>
          <input
            type="email"
            name="outlookAccount"
            id="outlookAccount"
            value={config.dataSources.outlookAccount}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
            placeholder="ex: votre.email@outlook.com"
          />
           <p className="text-xs text-slate-500 mt-1">Pour lire les événements de calendrier et les emails pertinents.</p>
        </div>
        <div>
          <label htmlFor="excelFolder" className="block text-sm font-medium text-slate-700 mb-1">
            Dossier des feuilles de temps Excel
          </label>
          <input
            type="text"
            name="excelFolder"
            id="excelFolder"
            value={config.dataSources.excelFolder}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
            placeholder="ex: C:\\Utilisateurs\\VotreNom\\Documents\\FeuillesDeTemps"
          />
          <p className="text-xs text-slate-500 mt-1">Chemin vers le dossier contenant vos fichiers Excel de suivi d'activité.</p>
        </div>
        <div>
          <label htmlFor="craBasePath" className="block text-sm font-medium text-slate-700 mb-1">
            Chemin de sauvegarde des CRAs
          </label>
          <input
            type="text"
            name="craBasePath"
            id="craBasePath"
            value={config.dataSources.craBasePath}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
            placeholder="ex: C:\\Utilisateurs\\VotreNom\\Documents\\CRAsGeneres"
          />
          <p className="text-xs text-slate-500 mt-1">Où les CRAs générés seront sauvegardés.</p>
        </div>
      </form>
       <div className="mt-6 p-3 bg-sky-50 border border-sky-200 rounded-md text-xs text-sky-700">
        <span className="font-semibold">Note :</span> L'intégration réelle avec Outlook et les systèmes de fichiers locaux nécessiterait des permissions spécifiques et potentiellement une application de bureau ou des extensions. Cette interface est une maquette pour le flux de configuration.
      </div>
    </div>
  );
};

export default StepDataSources;
