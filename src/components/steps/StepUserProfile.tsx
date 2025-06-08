import React, { useContext } from 'react';
import { ConfigContext } from '../../App';
import { UserProfile } from '../../types';
import { UserCircleIconSolid } from '../icons';

const StepUserProfile: React.FC = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("ConfigContext not found");

  const { config, updateConfig } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateConfig(prevConfig => ({
      ...prevConfig,
      userProfile: {
        ...prevConfig.userProfile,
        [name]: value,
      },
    }));
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-center mb-6">
        <UserCircleIconSolid className="w-12 h-12 text-blue-500 mr-3" />
        <h2 className="text-2xl font-semibold text-slate-700">Votre Profil Utilisateur</h2>
      </div>
      <p className="text-sm text-slate-600 mb-6 text-center">
        Ces informations nous aident à personnaliser votre expérience et à pré-remplir certains champs.
      </p>
      <form className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={config.userProfile.username}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
            placeholder="ex: Jean Dupont"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email professionnel
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={config.userProfile.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
            placeholder="ex: jean.dupont@entreprise.com"
          />
        </div>
        <div>
          <label htmlFor="trigram" className="block text-sm font-medium text-slate-700 mb-1">
            Trigramme CRA (si applicable)
          </label>
          <input
            type="text"
            name="trigram"
            id="trigram"
            value={config.userProfile.trigram}
            onChange={handleChange}
            maxLength={3}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
            placeholder="ex: JDU"
          />
           <p className="text-xs text-slate-500 mt-1">Votre identifiant court (généralement 3 lettres).</p>
        </div>
      </form>
    </div>
  );
};

export default StepUserProfile;
