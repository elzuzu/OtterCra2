
import { WizardStep, WizardStepId, ApiProviderDetail, ValidationFeedbackData, LlmProviderId } from './types';

export const WIZARD_STEPS_CONFIG: Record<WizardStepId, WizardStep> = {
  [WizardStepId.Welcome]: { id: WizardStepId.Welcome, name: "Welcome", title: "Bienvenue chez OtterCra", skippable: false },
  [WizardStepId.UserProfile]: { id: WizardStepId.UserProfile, name: "User Profile", title: "Profil Utilisateur", skippable: false },
  [WizardStepId.LlmProviders]: { id: WizardStepId.LlmProviders, name: "LLM Providers", title: "Configuration APIs LLM", skippable: false },
  [WizardStepId.DataSources]: { id: WizardStepId.DataSources, name: "Data Sources", title: "Sources de Données", skippable: true },
  [WizardStepId.TestConnectivity]: { id: WizardStepId.TestConnectivity, name: "Test Connectivity", title: "Test de Connectivité", skippable: false },
  [WizardStepId.Finalization]: { id: WizardStepId.Finalization, name: "Finalization", title: "Finalisation", skippable: false },
};

export const WIZARD_STEPS_ORDER: WizardStepId[] = [
  WizardStepId.Welcome,
  WizardStepId.UserProfile,
  WizardStepId.LlmProviders,
  WizardStepId.DataSources,
  WizardStepId.TestConnectivity,
  WizardStepId.Finalization,
];

export const LLM_PROVIDERS_DETAILS: Record<LlmProviderId, ApiProviderDetail> = {
  groq: {
    id: 'groq',
    name: "Groq",
    priority: 1,
    recommended: true,
    reason: "Gratuit, très rapide, modèles performants",
    signupUrl: "https://console.groq.com/",
    apiKeyHelp: "Obtenez votre clé sur console.groq.com → API Keys",
    testModel: "llama-3.3-70b-versatile", // This is just informational for the user
    validationRegex: /^gsk_[a-zA-Z0-9]{48}$/,
  },
  gemini: {
    id: 'gemini',
    name: "Google Gemini",
    priority: 2,
    recommended: true,
    reason: "Gratuit avec quota généreux",
    signupUrl: "https://makersuite.google.com/app/apikey",
    apiKeyHelp: "Obtenez votre clé sur AI Studio → Get API Key",
    testModel: "gemini-2.5-flash-preview-04-17", // Using current supported model for tests
    validationRegex: /^AIza[a-zA-Z0-9_-]{35}$/,
  },
  openai_compatible: {
    id: 'openai_compatible',
    name: "OpenAI Compatible",
    priority: 3,
    recommended: false,
    reason: "Pour utilisateurs avancés (Ollama local, etc.)",
    signupUrl: "#", // Placeholder
    apiKeyHelp: "Entrez votre clé API et l'URL de base si nécessaire.",
    validationRegex: /^sk-[a-zA-Z0-9]{20,70}$/, // General OpenAI-like key format
    customConfig: true, // Indicates need for more fields like base URL
  },
};

export const VALIDATION_FEEDBACK_MESSAGES: Record<string, ValidationFeedbackData> = {
  idle: { icon: "", message: ""},
  typing: { icon: "⌨️", message: "Saisie clé API..." },
  format_valid: { icon: "✅", message: "Format clé valide", color: "text-green-600" },
  format_invalid: { icon: "❌", message: "Format clé invalide - vérifiez la saisie", color: "text-red-600" },
  testing: { icon: "🔄", message: "Test connexion en cours...", spinner: true },
  test_success: { icon: "🎉", message: "Connexion réussie !", color: "text-green-600" },
  test_failed: { icon: "⚠️", message: "Échec connexion.", color: "text-red-600" },
};

export const CONFIG_STORAGE_KEY = 'otterCraAppConfig';
