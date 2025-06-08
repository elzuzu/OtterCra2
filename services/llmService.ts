
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LLM_PROVIDERS_DETAILS }  from '../constants';
import { ApiProviderDetail, GenerateContentResponseLight, LlmProviderId } from "../types";

interface TestResult {
  success: boolean;
  message: string;
  quotaInfo?: string;
  details?: unknown;
}

// IMPORTANT: In a production app, the Gemini API key should ideally be handled via `process.env.API_KEY`
// and managed securely, possibly via a backend proxy.
// For this client-side wizard, we use the key provided by the user directly for testing.
const testGeminiConnectivity = async (apiKey: string, modelName: string): Promise<TestResult> => {
  if (!apiKey) {
    return { success: false, message: "Clé API Gemini non fournie." };
  }
  try {
    // Note: The prompt requests that API_KEY be from process.env.
    // However, for user-inputted key testing, we must use the provided key.
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName, // e.g., 'gemini-2.5-flash-preview-04-17'
        contents: "Test de connexion. Répondez simplement 'OK'.",
        config: {
          // For low latency test, disable thinking. For other tasks, omit this.
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
    // You might want to parse error for specific codes like 401, 403, 429
    // For example, error.httpError?.statusCode
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
    // Groq uses an OpenAI-compatible API structure for listing models
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      //const data = await response.json();
      // Optionally check if data.data contains expected models
      return { success: true, message: "Connexion Groq réussie.", quotaInfo: "Quota non vérifié via ce test." };
    } else {
      let errorMsg = `Erreur Groq: ${response.status} ${response.statusText}.`;
      if(response.status === 401) errorMsg = "Clé API Groq invalide ou non autorisée.";
      // const errorData = await response.json().catch(() => null);
      // if (errorData && errorData.error && errorData.error.message) {
      //   errorMsg += ` Détails: ${errorData.error.message}`;
      // }
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
  // For generic OpenAI compatible, we'll assume a /models endpoint
  // User might need to provide a baseUrl for local/custom deployments
  const effectiveBaseUrl = baseUrl || 'https://api.openai.com/v1'; // Default to OpenAI if no custom URL
  
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
  // Optional customBaseUrl for openai_compatible
  customBaseUrl?: string 
): Promise<TestResult> => {
  const providerDetails = LLM_PROVIDERS_DETAILS[providerId];
  if (!providerDetails) {
    // This case should ideally not be reached if LlmProviderId is used correctly.
    return { success: false, message: "Fournisseur LLM inconnu." };
  }

  if (!apiKey.trim()) {
     return { success: false, message: "La clé API ne peut pas être vide." };
  }

  if (!validateApiKeyFormat(providerId, apiKey)) {
    return { success: false, message: "Format de clé API invalide." };
  }

  switch (providerId) {
    case 'gemini':
      return testGeminiConnectivity(apiKey, providerDetails.testModel || 'gemini-2.5-flash-preview-04-17');
    case 'groq':
      return testGroqConnectivity(apiKey);
    case 'openai_compatible':
      // For a real app, you might need a way for the user to input the base URL for Ollama, etc.
      // For now, it's simplified.
      return testOpenAICompatibleConnectivity(apiKey, customBaseUrl);
    default:
      // With LlmProviderId, this default case should be exhaustive or handle LlmProviderId explicitly.
      // However, switch statement will ensure type safety.
      return { success: false, message: "Test de connectivité non implémenté pour ce fournisseur." };
  }
};
