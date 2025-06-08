
import React, { useState, useContext, useEffect } from 'react';
import { WIZARD_STEPS_CONFIG, WIZARD_STEPS_ORDER } from '../constants';
import { WizardStepId, AppConfig } from '../types';
import StepWelcome from './steps/StepWelcome';
import StepUserProfile from './steps/StepUserProfile';
import StepLlmProviders from './steps/StepLlmProviders';
import StepDataSources from './steps/StepDataSources';
import StepTestConnectivity from './steps/StepTestConnectivity';
import StepFinalization from './steps/StepFinalization';
import { ConfigContext } from '../App';
import { SparklesIcon } from './icons';

interface SetupWizardProps {
  onSetupComplete: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onSetupComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error("ConfigContext must be used within a ConfigProvider");
  }
  const { config, updateConfig } = context;

  const currentStepId = WIZARD_STEPS_ORDER[currentStepIndex];
  const currentStepInfo = WIZARD_STEPS_CONFIG[currentStepId];

  // Effect to mark userProfile as configured when fields are filled
  useEffect(() => {
    if (currentStepId === WizardStepId.UserProfile) {
        const { username, email, trigram } = config.userProfile;
        if (username && email && trigram && !config.setupFlags.userProfileConfigured) {
            updateConfig(prev => ({
                ...prev,
                setupFlags: { ...prev.setupFlags, userProfileConfigured: true }
            }));
        }
    }
  }, [config.userProfile, currentStepId, updateConfig, config.setupFlags.userProfileConfigured]);


  const handleNext = () => {
    if (currentStepIndex < WIZARD_STEPS_ORDER.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Final step completed
      updateConfig(prev => ({
        ...prev,
        setupFlags: { ...prev.setupFlags, firstLaunchCompleted: true, connectivityValidated: true }, // Assume connectivity was validated
        userProfile: { ...prev.userProfile, setupCompleted: new Date().toISOString(), setupVersion: "1.0" }
      }));
      onSetupComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const handleSkip = () => {
    if (currentStepInfo.skippable) {
        if (currentStepId === WizardStepId.DataSources) {
            updateConfig(prev => ({
                ...prev,
                setupFlags: { ...prev.setupFlags, dataSourcesConfigured: true } // Mark as "configured" even if skipped
            }));
        }
        handleNext();
    }
  };

  const isNextDisabled = (): boolean => {
    if (currentStepId === WizardStepId.UserProfile) {
      return !config.userProfile.username || !config.userProfile.email || !config.userProfile.trigram;
    }
    if (currentStepId === WizardStepId.LlmProviders) {
      const configuredProviders = Object.values(config.llmConfig.providers).filter(p => p.isConfigured && p.apiKeyInfo.status === 'valid');
      return configuredProviders.length === 0; // Must configure at least one LLM
    }
    // Add other step-specific validations if needed
    return false;
  };
  
  const getStepStatus = (stepIndex: number): string => {
    if (stepIndex < currentStepIndex) return 'step-completed';
    if (stepIndex === currentStepIndex) return 'step-active';
    return 'step-inactive';
  };

  const renderStepContent = () => {
    switch (currentStepId) {
      case WizardStepId.Welcome:
        return <StepWelcome />;
      case WizardStepId.UserProfile:
        return <StepUserProfile />;
      case WizardStepId.LlmProviders:
        return <StepLlmProviders />;
      case WizardStepId.DataSources:
        return <StepDataSources />;
      case WizardStepId.TestConnectivity:
        return <StepTestConnectivity />;
      case WizardStepId.Finalization:
        return <StepFinalization />;
      default:
        return <div>Étape inconnue</div>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-200 to-sky-100">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <header className="bg-slate-700 p-6 text-white">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-10 h-10 text-sky-400" />
            <div>
                <h1 className="text-3xl font-bold">OtterCra Setup</h1>
                <p className="text-slate-300">Configuration initiale de votre assistant CRA</p>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="px-6 pt-6 pb-2">
            <div className="flex items-center">
                {WIZARD_STEPS_ORDER.map((stepId, index) => (
                    <React.Fragment key={stepId}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${getStepStatus(index)}`}>
                                {index + 1}
                            </div>
                            <p className={`mt-1 text-xs text-center ${index === currentStepIndex ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}>{WIZARD_STEPS_CONFIG[stepId].title.split(' ')[0]}</p>
                        </div>
                        {index < WIZARD_STEPS_ORDER.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
             <p className="text-sm text-slate-600 mt-3 text-center">Étape {currentStepIndex + 1} sur {WIZARD_STEPS_ORDER.length}: <span className="font-semibold">{currentStepInfo.title}</span></p>
        </div>
        
        <main className="p-6 md:p-8 min-h-[300px]">
          {renderStepContent()}
        </main>

        <footer className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-200">
          <div>
            {currentStepIndex > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md shadow-sm transition-colors"
              >
                Précédent
              </button>
            )}
          </div>
          <div className="space-x-3">
            {currentStepInfo.skippable && (
                 <button
                    onClick={handleSkip}
                    className="px-6 py-2 text-sm font-medium text-sky-600 hover:text-sky-800 rounded-md transition-colors"
                >
                    Passer cette étape
                </button>
            )}
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className={`px-8 py-3 text-sm font-semibold text-white rounded-md shadow-md transition-all duration-150 ${
                isNextDisabled()
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
              }`}
            >
              {currentStepIndex === WIZARD_STEPS_ORDER.length - 1 ? 'Terminer le Setup' : 'Suivant'}
            </button>
          </div>
        </footer>
      </div>
       <p className="mt-8 text-xs text-slate-500">OtterCra &copy; {new Date().getFullYear()}</p>
    </div>
  );
};

export default SetupWizard;
