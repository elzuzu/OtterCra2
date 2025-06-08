# OtterCra - Feuille de Route (Alignée sur Spécifications)

## ✅ Phase 1: Initialisation, Configuration & Cœur Fonctionnel

### 🚀 1. Wizard de Premier Lancement (Setup)

- [x] Architecture: Définir la structure du wizard et de ses étapes obligatoires/optionnelles.
- [x] UI: Créer le composant principal SetupWizard.tsx qui gère le flux des étapes.
- [x] État du Wizard: Mettre en place la gestion de l'état pour la navigation et la persistance des données durant le setup.
- [x] Étape 1: Bienvenue: Créer le composant steps/StepWelcome.tsx.
- [x] Étape 2: Profil Utilisateur: Créer le composant steps/StepUserProfile.tsx.
- [ ] Étape 3: Configuration des Fournisseurs LLM:
  - [x] Créer le composant steps/StepLlmProviders.tsx.
  - [x] Intégrer ApiKeyInput.tsx pour une saisie intuitive des clés.
  - [ ] Validation en Temps Réel:
    - [ ] Implémenter la vérification du format de la clé (regex) à la volée.
    - [ ] Afficher un feedback visuel instantané (icône ✅/❌, message de format).
  - [ ] Test de Connectivité Automatique:
    - [ ] Déclencher un appel API de test dès qu'une clé au format valide est saisie.
    - [ ] Gérer et afficher les états: "Test en cours...", "Connexion réussie", "Échec de la connexion".
    - [ ] Extraire et afficher les infos de quota (si disponible via l'API) en cas de succès.
  - [ ] Gérer la configuration optionnelle pour les fournisseurs compatibles OpenAI (Ollama, etc.).
- [ ] Étape 4: Sources de Données:
  - [x] Créer le composant steps/StepDataSources.tsx.
  - [ ] Implémenter la logique de sélection des chemins de fichiers/dossiers pour Outlook, Excel et le répertoire des CRA.
- [ ] Étape 5: Test de Connectivité Global:
  - [x] Créer le composant steps/StepTestConnectivity.tsx.
  - [ ] Implémenter la logique pour tester toutes les connexions configurées (LLMs, accès aux dossiers).
- [ ] Étape 6: Finalisation:
  - [x] Créer le composant steps/StepFinalization.tsx.
  - [ ] Implémenter la sauvegarde finale et le chiffrement de la configuration.
  - [ ] Afficher un message de succès et fermer le wizard.

### 💾 2. Gestion de la Configuration

- [ ] Service (services/configService.ts):
  - [x] Définir les types de configuration dans types.ts en accord avec les spécifications.
  - [ ] Implémenter la logique de chargement/sauvegarde de la configuration sur le disque local.
  - [ ] Sécurité: Intégrer une fonction de chiffrement/déchiffrement pour les clés API avant écriture/lecture sur disque.
  - [ ] Gérer la détection de configuration absente ou invalide pour déclencher le wizard au lancement.

### 🤖 3. Cœur du Moteur LLM

- [ ] Service (services/llmService.ts):
  - [x] Mettre en place les appels de base pour les fournisseurs (Groq, Gemini).
  - [ ] Stratégie de Basculement (Fallback): Si un appel au fournisseur primaire (groq) échoue, tenter automatiquement avec le(s) fournisseur(s) secondaire(s) (gemini).
  - [ ] Stratégie de Réessai (Retry): Pour les erreurs réseau ou de service temporaires, implémenter une logique de réessai (ex: 2 tentatives avec un court délai).
  - [ ] Gestion des Erreurs: Centraliser la gestion des codes d'erreur API (401, 403, 429, 5xx) pour informer les autres modules.

## Phase 2: Robustesse & Expérience Utilisateur

### ❤️‍🩹 4. Monitoring de la Santé et Diagnostics

- [ ] Dashboard de Santé:
  - [x] Créer le composant HealthDashboard.tsx.
  - [ ] Connecter le dashboard au service de monitoring pour afficher en temps réel :
    - Le statut de chaque fournisseur (Healthy, Degraded, Down).
    - Le quota d'utilisation et le temps de réponse moyen.
- [ ] Monitoring en Arrière-plan:
  - [ ] Implémenter un health check non-bloquant au démarrage de l'application.
  - [ ] Mettre en place un health check périodique (ex: toutes les 30 min) pour mettre à jour le statut des services.
- [ ] Détection Proactive de Problèmes:
  - [ ] Créer un système de notification dans l'UI pour alerter l'utilisateur (ex: "La clé Groq a expiré", "Le quota Gemini est presque atteint").

### ⚙️ 5. Re-configuration Intelligente

- [ ] Déclenchement Conditionnel:
  - [ ] Si une erreur de type "clé invalide" (401/403) est détectée, afficher une notification proposant de corriger la clé.
  - [ ] Créer une interface (ex: une modale) pour mettre à jour un champ de configuration spécifique sans avoir à relancer tout le wizard.
- [ ] Diagnostic et Résolution Guidée:
  - [ ] Créer une section ou un outil de diagnostic qui teste toutes les connexions et suggère des actions correctives.

## Phase 3: Interfaces Étendues & Packaging

### 命令行 6. Interface en Ligne de Commande (CLI)

- [ ] app setup: Lancer le wizard de configuration en mode interactif dans le terminal.
- [ ] app diagnose: Exécuter les tests de connectivité et afficher un rapport de santé.
- [ ] app generate: Commande principale pour lancer la génération d'un CRA.
- [ ] app reconfig --provider <provider_name>: Permettre la mise à jour ciblée d'une clé API.

### 📦 7. Packaging de l'Application Desktop

- [ ] Mettre en place un framework comme Tauri ou Electron pour packager l'application React.
- [ ] Créer un build pour Windows (win32, x64).
- [ ] Configurer la création d'un installateur et de raccourcis.

### 🔌 8. Intégration Finale des Sources de Données

- [ ] Outlook: Implémenter la connexion et la lecture des données du calendrier/emails.
- [ ] Excel: Finaliser le module de parsing pour les fichiers de feuilles de temps.