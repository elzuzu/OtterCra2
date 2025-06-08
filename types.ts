
export type LlmProviderId = 'groq' | 'gemini' | 'openai_compatible';

export interface UserProfile {
  username: string;
  email: string;
  trigram: string;
}

export interface LlmProviderApiKeyInfo {
  key: string;
  status: 'pending' | 'validating' | 'valid' | 'invalid' | 'error';
  message: string;
  lastValidated?: string;
  quotaInfo?: string;
}

export interface LlmProviderConfig {
  apiKeyInfo: LlmProviderApiKeyInfo;
  isConfigured: boolean; // True if key is entered and validated at least once
}

export interface LlmConfig {
  providers: {
    groq: LlmProviderConfig;
    gemini: LlmProviderConfig;
    openai_compatible: LlmProviderConfig;
  };
  primaryProvider?: LlmProviderId;
  fallbackOrder: Array<LlmProviderId>;
  autoRetryEnabled: boolean;
  setupCompleted: boolean;
}

export interface DataSources {
  outlookAccount: string;
  excelFolder: string;
  craBasePath: string;
}

export interface AppConfig {
  userProfile: UserProfile & { setupCompleted?: string; setupVersion?: string };
  llmConfig: LlmConfig;
  dataSources: DataSources & { configured?: boolean };
  setupFlags: {
    firstLaunchCompleted: boolean;
    userProfileConfigured: boolean;
    llmProvidersConfigured: boolean;
    dataSourcesConfigured: boolean; // True if skipped or at least one field filled
    connectivityValidated: boolean; // True if at least one LLM is validated successfully
  };
}

export enum WizardStepId {
  Welcome = 'welcome',
  UserProfile = 'user_profile',
  LlmProviders = 'llm_providers_setup',
  DataSources = 'data_sources',
  TestConnectivity = 'test_connectivity',
  Finalization = 'finalization',
}

export interface WizardStep {
  id: WizardStepId;
  name: string;
  title: string;
  skippable: boolean;
}

export interface ApiProviderDetail {
  id: LlmProviderId;
  name: string;
  priority: number;
  recommended: boolean;
  reason: string;
  signupUrl: string;
  apiKeyHelp: string;
  testModel?: string;
  validationRegex: RegExp;
  customConfig?: boolean;
}

export type ValidationStatus = 'typing' | 'format_valid' | 'format_invalid' | 'testing' | 'test_success' | 'test_failed' | 'idle';

export interface ValidationFeedbackData {
  icon: string;
  message: string;
  color?: string; // Tailwind text color class e.g. 'text-green-500'
  spinner?: boolean;
}

// For Gemini API responses
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // Other types of chunks can be added here
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // Other candidate fields like content, finishReason, etc.
}

export interface GenerateContentResponseLight {
  text: string;
  candidates?: Candidate[];
}

export type TestResultStatus = 'pending' | 'testing' | 'success' | 'failed' | 'info';

export interface TestItem {
  id: string; // Unique ID for the test (e.g., providerId, or 'outlook', 'excelFolder')
  name: string;
  status: TestResultStatus;
  message: string;
  type: 'llm' | 'dataSource'; // To differentiate test types
}


export const initialAppConfig: AppConfig = {
  userProfile: {
    username: '',
    email: '',
    trigram: '',
  },
  llmConfig: {
    providers: {
      groq: { apiKeyInfo: { key: '', status: 'pending', message: '' }, isConfigured: false },
      gemini: { apiKeyInfo: { key: '', status: 'pending', message: '' }, isConfigured: false },
      openai_compatible: { apiKeyInfo: { key: '', status: 'pending', message: '' }, isConfigured: false },
    },
    fallbackOrder: ['groq', 'gemini'], 
    autoRetryEnabled: true,
    setupCompleted: false,
  },
  dataSources: {
    outlookAccount: '',
    excelFolder: '',
    craBasePath: '',
    configured: false,
  },
  setupFlags: {
    firstLaunchCompleted: false,
    userProfileConfigured: false,
    llmProvidersConfigured: false,
    dataSourcesConfigured: false,
    connectivityValidated: false,
  },
};

export interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig> | ((prevConfig: AppConfig) => AppConfig)) => void;
  updateLlmProviderKey: (providerId: keyof AppConfig['llmConfig']['providers'], key: string) => void;
  updateLlmProviderStatus: (
    providerId: keyof AppConfig['llmConfig']['providers'], 
    status: LlmProviderApiKeyInfo['status'],
    message: string,
    quotaInfo?: string
  ) => void;
  setLlmProviderConfigured: (providerId: keyof AppConfig['llmConfig']['providers'], isConfigured: boolean) => void;
}