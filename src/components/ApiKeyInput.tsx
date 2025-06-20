import React, { useState, useEffect, useCallback, useContext } from 'react';
import { validateApiKeyFormat, testApiKeyConnectivity } from '../services/llmService';
import { LLM_PROVIDERS_DETAILS, VALIDATION_FEEDBACK_MESSAGES } from '../constants';
import { ApiProviderDetail, ValidationStatus, ValidationFeedbackData, LlmProviderApiKeyInfo, LlmProviderId } from '../types';
import { ConfigContext } from '../App';
import { ArrowPathIcon, CheckIcon, EyeIcon, EyeSlashIcon, InformationCircleIcon, XCircleIcon } from './icons';

interface ApiKeyInputProps {
  providerId: LlmProviderId;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ providerId }) => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("ConfigContext not found");
  
  const { config, updateLlmProviderKey, updateLlmProviderStatus, setLlmProviderConfigured } = context;
  const providerApiKeyInfo = config.llmConfig.providers[providerId].apiKeyInfo;
  const apiKey = providerApiKeyInfo.key;

  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');
  const [feedback, setFeedback] = useState<ValidationFeedbackData>(VALIDATION_FEEDBACK_MESSAGES.idle);
  const [showKey, setShowKey] = useState<boolean>(false);
  
  const providerDetails = LLM_PROVIDERS_DETAILS[providerId];

  // Function to determine border color based on validation status
  const getBorderColorClass = (): string => {
    switch (validationStatus) {
      case 'test_success':
        return 'ring-green-500 focus:ring-green-500';
      case 'test_failed':
      case 'format_invalid':
        return 'ring-red-500 focus:ring-red-500';
      default: // Covers 'idle', 'testing', 'format_valid', 'pending', etc.
        return 'ring-slate-300 focus:ring-blue-500';
    }
  };

  const updateParentStatus = useCallback((status: LlmProviderApiKeyInfo['status'], message: string, quotaInfo?: string) => {
    updateLlmProviderStatus(providerId, status, message, quotaInfo);
    if(status === 'valid') {
        setLlmProviderConfigured(providerId, true);
    }
  }, [providerId, updateLlmProviderStatus, setLlmProviderConfigured]);


  useEffect(() => {
    // Sync local UI state from global config state (e.g. loaded from storage or changed by test)
    if (providerApiKeyInfo.status === 'valid') {
        setValidationStatus('test_success');
        setFeedback({ ...VALIDATION_FEEDBACK_MESSAGES.test_success, message: providerApiKeyInfo.message });
    } else if (providerApiKeyInfo.status === 'invalid' || providerApiKeyInfo.status === 'error') {
        setValidationStatus('test_failed');
        setFeedback({ ...VALIDATION_FEEDBACK_MESSAGES.test_failed, message: providerApiKeyInfo.message });
    } else if (providerApiKeyInfo.status === 'pending' && providerApiKeyInfo.key) {
        // Key is present, but status is pending (e.g. after typing, before test)
        if (validateApiKeyFormat(providerId, providerApiKeyInfo.key)) {
            setValidationStatus('format_valid');
            setFeedback(VALIDATION_FEEDBACK_MESSAGES.format_valid);
        } else {
            setValidationStatus('format_invalid');
            setFeedback(VALIDATION_FEEDBACK_MESSAGES.format_invalid);
        }
    } else if (providerApiKeyInfo.status === 'pending' && !providerApiKeyInfo.key) {
        setValidationStatus('idle');
        setFeedback(VALIDATION_FEEDBACK_MESSAGES.idle);
    }
  }, [providerId, providerApiKeyInfo.status, providerApiKeyInfo.message, providerApiKeyInfo.key]);


  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    updateLlmProviderKey(providerId, newKey); // This updates global state, effect above will sync UI
  };

  const handleTestConnectivity = async () => {
    if (!validateApiKeyFormat(providerId, apiKey)) {
      setValidationStatus('format_invalid'); 
      setFeedback(VALIDATION_FEEDBACK_MESSAGES.format_invalid); 
      updateParentStatus('error', 'Test annulé: format de clé invalide.'); 
      return;
    }

    setValidationStatus('testing'); 
    setFeedback(VALIDATION_FEEDBACK_MESSAGES.testing); 
    updateParentStatus('validating', 'Test en cours...'); 

    const result = await testApiKeyConnectivity(providerId, apiKey);

    if (result.success) {
      updateParentStatus('valid', result.message || VALIDATION_FEEDBACK_MESSAGES.test_success.message, result.quotaInfo);
    } else {
      updateParentStatus('error', result.message);
    }
  };
  
  const getFeedbackIcon = () => {
    switch(validationStatus) {
        case 'format_valid': return <CheckIcon className="text-green-500" />;
        case 'format_invalid': return <XCircleIcon className="text-red-500" />;
        case 'testing': return <ArrowPathIcon className="text-blue-500" />;
        case 'test_success': return <CheckIcon className="text-green-500" />;
        case 'test_failed': return <XCircleIcon className="text-red-500" />;
        case 'idle': return null;
        default: return <InformationCircleIcon className="text-gray-400" />;
    }
  }

  return (
    <div className="p-5 border border-slate-300 rounded-lg shadow-md bg-white transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-semibold text-slate-700">{providerDetails.name}</h3>
        {providerDetails.recommended && !config.llmConfig.providers[providerId].isConfigured && (
            <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Recommandé</span>
        )}
         {config.llmConfig.providers[providerId].isConfigured && config.llmConfig.providers[providerId].apiKeyInfo.status === 'valid' &&(
            <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full flex items-center">
                <CheckIcon className="w-3 h-3 mr-1"/> Connecté
            </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-3">{providerDetails.reason}</p>
      
      <div className="mb-3">
        <label htmlFor={`${providerId}-apikey`} className="block text-sm font-medium text-slate-600 mb-1">
          Clé API {providerDetails.name}
        </label>
        <div className="relative">
            <input
            type={showKey ? "text" : "password"}
            id={`${providerId}-apikey`}
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder={providerDetails.validationRegex.source.startsWith('^gsk_') ? "gsk_..." : (providerDetails.validationRegex.source.startsWith('^AIza') ? "AIza..." : "sk_...")}
            className={`w-full px-4 py-2.5 rounded-lg shadow-sm transition-colors placeholder-slate-400 text-sm ring-1 ring-inset ${getBorderColorClass()} focus:ring-2`}
            aria-describedby={`${providerId}-feedback`}
            />
             <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-600"
                aria-label={showKey ? "Cacher la clé" : "Montrer la clé"}
            >
                {showKey ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
        </div>
        
        <div id={`${providerId}-feedback`} className={`mt-2 text-xs flex items-center min-h-[20px] ${feedback.color || 'text-slate-600'}`}>
            {apiKey && validationStatus !== 'idle' && <span className="mr-1.5">{getFeedbackIcon()}</span> }
            {apiKey && feedback.message}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <a
          href={providerDetails.signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          {providerDetails.apiKeyHelp}
        </a>
        <button
          onClick={handleTestConnectivity}
          disabled={validationStatus === 'testing' || !validateApiKeyFormat(providerId, apiKey) || !apiKey}
          className={`px-5 py-2 text-xs font-semibold rounded-md shadow-sm transition-colors ${
            (!validateApiKeyFormat(providerId, apiKey) || !apiKey)
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : validationStatus === 'testing'
              ? 'bg-blue-300 text-white cursor-wait'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {validationStatus === 'testing' ? 'Test en cours...' : 'Tester la Connexion'}
        </button>
      </div>
    </div>
  );
};

export default ApiKeyInput;
