import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LLM_PROVIDERS_DETAILS }  from '../constants';
import { ApiProviderDetail, LlmProviderId } from "../types";

interface TestResult {
  success: boolean;
  message: string;
  quotaInfo?: string;
  details?: unknown;
}

const testGeminiConnectivity = async (apiKey: string, modelName: string): Promise<TestResult> => {
  if (!apiKey) {
    return { success: false, message: "Clé API Gemini non fournie." };
  }
  try {
    const ai = new GoogleGenAI({ apiKey: apiKey }); // Use user-provided key for testing
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName, 
        contents: "Test de connexion. Répondez simplement 'OK'.",
        config: {
          thinkingConfig: { thinkingBudget: 0 } 
        }
    });
    
    const textResponse = response.text;
    if (textResponse && textResponse.toLowerCase().includes("ok")) {
      return { success: true, message: "Connexion Gemini réussie.", quotaInfo: "Quota non vérifié via ce test." };
    }
    return { success: false, message: `Réponse inattendue de Gemini: ${textResponse}` };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMessage = "Échec de la connexion à Gemini.";
    if (error.message) {
        errorMessage += ` Détails: ${error.message}`;
    }
    if (error.toString().includes("API key not valid")) {
        errorMessage = "Clé API Gemini invalide ou non autorisée.";
    } else if (error.toString().includes("quota")) {
        errorMessage = "Quota Gemini dépassé ou problème de facturation.";
    }
    return { success: false, message: errorMessage, details: error };
  }
};

const testGroqConnectivity = async (apiKey: string): Promise<TestResult> => {
  if (!apiKey) {
    return { success: false, message: "Clé API Groq non fournie." };
  }
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      return { success: true, message: "Connexion Groq réussie.", quotaInfo: "Quota non vérifié via ce test." };
    } else {
      let errorMsg = `Erreur Groq: ${response.status} ${response.statusText}.`;
      if(response.status === 401) errorMsg = "Clé API Groq invalide ou non autorisée.";
      try {
        const errorData = await response.json();
        if (errorData && errorData.error && errorData.error.message) {
            errorMsg += ` Détails: ${errorData.error.message}`;
        }
      } catch(e) {/* no json body */}
      return { success: false, message: errorMsg };
    }
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return { success: false, message: `Échec de la connexion à Groq: ${error.message}` };
  }
};

const testOpenAICompatibleConnectivity = async (apiKey: string, baseUrl?: string): Promise<TestResult> => {
  if (!apiKey) {
    return { success: false, message: "Clé API non fournie." };
  }
  const effectiveBaseUrl = baseUrl || 'https://api.openai.com/v1'; 
  
  try {
    const response = await fetch(`${effectiveBaseUrl.replace(/\/+$/, '')}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      return { success: true, message: "Connexion OpenAI-compatible réussie.", quotaInfo: "Quota non vérifié." };
    } else {
      let errorMsg = `Erreur OpenAI-compatible: ${response.status} ${response.statusText}.`;
      if(response.status === 401) errorMsg = "Clé API invalide ou non autorisée.";
       try {
        const errorData = await response.json();
        if (errorData && errorData.error && errorData.error.message) {
            errorMsg += ` Détails: ${errorData.error.message}`;
        }
      } catch(e) {/* no json body */}
      return { success: false, message: errorMsg };
    }
  } catch (error: any) {
    console.error("OpenAI-Compatible API Error:", error);
    return { success: false, message: `Échec de la connexion: ${error.message}` };
  }
};


export const validateApiKeyFormat = (providerId: LlmProviderId, apiKey: string): boolean => {
  const providerDetails = LLM_PROVIDERS_DETAILS[providerId];
  if (!providerDetails || !apiKey) return false;
  return providerDetails.validationRegex.test(apiKey);
};

export const testApiKeyConnectivity = async (
  providerId: LlmProviderId, 
  apiKey: string,
  customBaseUrl?: string 
): Promise<TestResult> => {
  const providerDetails = LLM_PROVIDERS_DETAILS[providerId];
  if (!providerDetails) {
    return { success: false, message: "Fournisseur LLM inconnu." };
  }

  if (!apiKey.trim()) {
     return { success: false, message: "La clé API ne peut pas être vide." };
  }

  // Format validation is now done in ApiKeyInput before calling this,
  // but can be kept as a safeguard or removed if redundant.
  // if (!validateApiKeyFormat(providerId, apiKey)) {
  //   return { success: false, message: "Format de clé API invalide." };
  // }

  switch (providerId) {
    case 'gemini':
      return testGeminiConnectivity(apiKey, providerDetails.testModel || 'gemini-2.5-flash-preview-04-17');
    case 'groq':
      return testGroqConnectivity(apiKey);
    case 'openai_compatible':
      return testOpenAICompatibleConnectivity(apiKey, customBaseUrl);
    default:
      // This ensures that if LlmProviderId adds new values, TypeScript will complain here.
      // It's good practice for exhaustiveness checking with union types.
      const _exhaustiveCheck: never = providerId;
      return { success: false, message: `Test de connectivité non implémenté pour ce fournisseur: ${_exhaustiveCheck}` };
  }
};
