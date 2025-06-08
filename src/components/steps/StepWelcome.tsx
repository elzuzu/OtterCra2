import React from 'react';
import { SparklesIcon } from '../icons';

const StepWelcome: React.FC = () => {
  return (
    <div className="text-center">
      <SparklesIcon className="w-16 h-16 text-blue-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-slate-800 mb-4">Bienvenue dans OtterCra !</h2>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        Nous allons vous guider à travers quelques étapes rapides pour configurer votre application
        d'automatisation de génération de Compte Rendu d'Activité (CRA).
      </p>
      <p className="text-sm text-slate-500 mb-8">
        Ce processus prendra environ 5 minutes.
      </p>
      <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg text-sm text-sky-700">
        <p className="font-semibold">Prochaines étapes :</p>
        <ul className="list-disc list-inside ml-4 mt-1">
          <li>Configuration de votre profil utilisateur.</li>
          <li>Connexion à vos fournisseurs LLM (IA).</li>
          <li>Liaison de vos sources de données (optionnel).</li>
        </ul>
      </div>
    </div>
  );
};

export default StepWelcome;
