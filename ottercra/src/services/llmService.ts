// ottercra/src/services/llmService.ts

import { ApiKeyValidationResult } from '../types';

/**
 * Simule un test de connectivité pour une clé API donnée.
 * Dans une application réelle, cette fonction ferait un véritable appel HTTP
 * à l'endpoint de l'API du fournisseur (par ex. /v1/models).
 * * @param provider - Le nom du fournisseur (ex: 'groq', 'gemini').
 * @param apiKey - La clé API à tester.
 * @returns Une promesse qui se résout avec le résultat de la validation.
 */
export const testApiKeyConnectivity = async (provider: string, apiKey: string): Promise<ApiKeyValidationResult> => {
  console.log(`Testing connectivity for ${provider} with key ${apiKey.substring(0, 8)}...`);

  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulation de différents scénarios de réponse
  // Dans un cas réel, on analyserait la réponse HTTP (status code, body).
  if (apiKey.endsWith('invalid_key')) {
    // Simule une clé invalide (erreur 401/403)
    console.error(`Test failed for ${provider}: Invalid API Key.`);
    return {
      status: 'error',
      message: 'La clé API est invalide ou a expiré.',
    };
  }

  if (apiKey.endsWith('quota_exceeded')) {
    // Simule un quota dépassé (erreur 429)
    console.error(`Test failed for ${provider}: Quota exceeded.`);
    return {
      status: 'error',
      message: 'Le quota pour cette clé a été atteint.',
    };
  }

  if (apiKey.endsWith('service_unavailable')) {
     // Simule une erreur serveur (5xx)
    console.error(`Test failed for ${provider}: Service unavailable.`);
    return {
        status: 'error',
        message: 'Le service du fournisseur est actuellement indisponible.',
    };
  }

  // Si aucun des cas d'erreur précédents n'est rencontré, on simule un succès.
  console.log(`Test successful for ${provider}.`);
  return {
    status: 'success',
    message: `Connexion à ${provider} réussie ! Prêt à générer.`,
  };
};
