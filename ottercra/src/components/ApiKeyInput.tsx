// ottercra/src/components/ApiKeyInput.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { ApiKeyStatus, ApiKeyValidationResult } from '../types';
import { CheckCircle, AlertTriangle, Loader, KeyRound, Eye, EyeOff } from 'lucide-react';
import { testApiKeyConnectivity } from '../services/llmService';
import { useDebounce } from '../hooks/useDebounce'; // Un hook custom à créer

// Helper pour le hook useDebounce
// Créez un fichier src/hooks/useDebounce.ts et mettez-y ce code
/*
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
*/


interface ApiKeyInputProps {
  providerName: string;
  providerProfile: {
    format_regex: RegExp;
    signup_url: string;
    api_key_help: string;
  };
  value: string;
  onChange: (value: string) => void;
  onValidationComplete: (result: ApiKeyValidationResult) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ providerName, providerProfile, value, onChange, onValidationComplete }) => {
  const [status, setStatus] = useState<ApiKeyStatus>('idle');
  const [message, setMessage] = useState<string>(providerProfile.api_key_help);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const debouncedValue = useDebounce(value, 800); // Délais avant de lancer le test de connectivité

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'error':
      case 'format_invalid':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const validateAndTest = useCallback(async (key: string) => {
    if (!key) {
      setStatus('idle');
      setMessage(providerProfile.api_key_help);
      onValidationComplete({ status: 'idle', message: providerProfile.api_key_help }); // Notify parent about idle state
      return;
    }

    if (!providerProfile.format_regex.test(key)) {
      setStatus('format_invalid');
      const errorResult = { status: 'format_invalid' as ApiKeyStatus, message: "Format de la clé invalide." };
      setMessage(errorResult.message);
      onValidationComplete(errorResult);
      return;
    }

    setStatus('validating');
    setMessage('Format valide. Test de la connexion en cours...');
    // Notify parent that validation is in progress
    onValidationComplete({ status: 'validating', message: 'Test de la connexion en cours...' });

    const result = await testApiKeyConnectivity(providerName, key);

    setStatus(result.status);
    setMessage(result.message);
    onValidationComplete(result);

  }, [providerName, providerProfile, onValidationComplete]);


  useEffect(() => {
    // Only call validateAndTest if debouncedValue is not empty.
    // If debouncedValue is empty, it means the input was cleared,
    // and we want to reset to idle state, which is handled by handleInputChange.
    if (debouncedValue) {
      validateAndTest(debouncedValue);
    } else {
      // If the debounced value becomes empty (e.g., user deletes all text),
      // reset the status to idle.
      setStatus('idle');
      setMessage(providerProfile.api_key_help);
      onValidationComplete({ status: 'idle', message: providerProfile.api_key_help });
    }
  }, [debouncedValue, validateAndTest, providerProfile.api_key_help, onValidationComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();
    onChange(newValue);
    // Reset status to 'idle' immediately on input change if current status indicates a completed validation
    // This provides quicker feedback to the user that the previous validation state is no longer current.
    if (status === 'success' || status === 'error' || status === 'format_invalid') {
        setStatus('idle');
        setMessage(providerProfile.api_key_help);
        // Also notify the parent about this reset to 'idle'
        onValidationComplete({ status: 'idle', message: providerProfile.api_key_help });
    } else if (!newValue) {
      // If the input is cleared, reset to idle immediately
      setStatus('idle');
      setMessage(providerProfile.api_key_help);
      onValidationComplete({ status: 'idle', message: providerProfile.api_key_help });
    }
  };

  const renderIcon = () => {
    switch (status) {
      case 'validating':
        return <Loader className="animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="text-green-500" />;
      case 'error':
      case 'format_invalid':
        return <AlertTriangle className="text-red-500" />;
      default:
        return <KeyRound className="text-gray-400" />;
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-200 mb-1">
        Clé API pour {providerName.charAt(0).toUpperCase() + providerName.slice(1)}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {renderIcon()}
        </div>
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          value={value}
          onChange={handleInputChange}
          placeholder={`gsk_... ou AIza...`}
          className={`block w-full rounded-md border-0 bg-white/5 py-2.5 pl-10 pr-10 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
        </button>
      </div>
      <p className={`mt-2 text-sm ${getStatusColor()}`}>
        {message}
        {status === 'idle' && (
           <a href={providerProfile.signup_url} target="_blank" rel="noopener noreferrer" className="ml-1 underline hover:text-indigo-400">
             (Obtenir une clé)
           </a>
        )}
      </p>
    </div>
  );
};
