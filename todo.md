# OtterCra - Feuille de Route Technique Complète

Ce document détaille les étapes nécessaires pour faire évoluer ottercra2 d'un assistant de configuration à une application complète de génération de CRA, en atteignant et dépassant les fonctionnalités du projet de référence ottercra.

## ✅ Phase 0 : Fondations & Configuration (Terminé)
L'état actuel de ottercra2 constitue une base solide.
- [x] Wizard de Configuration Guidée : Interface utilisateur pour le premier lancement.
  - [x] Étape 1: Écran d'accueil.
  - [x] Étape 2: Saisie du profil utilisateur.
  - [x] Étape 3: Saisie des clés API pour les fournisseurs LLM.
  - [x] Étape 4: Saisie (optionnelle) des chemins pour les sources de données.
  - [x] Étape 5: Test de la connectivité des API LLM.
  - [x] Étape 6: Finalisation et sauvegarde de la configuration.
- [x] Gestion de la Configuration Locale :
  - [x] Sauvegarde des informations dans le localStorage du navigateur.
  - [x] Service configService.ts pour charger et sauvegarder la configuration.
- [x] Monitoring de Santé Post-Setup :
  - [x] Dashboard simple affichant le statut des services configurés.

## 📦 Phase 1 : Packaging & Accès Natif (Prérequis)
Objectif : Transformer l'application React en une application de bureau pour accéder aux fichiers locaux et aux applications de l'utilisateur.
- [ ] Mettre en place un framework d'application de bureau
  - Détails Techniques : Choisir et configurer Tauri ou Electron. Tauri est recommandé pour sa légèreté et sa sécurité.
  - Actions :
    - [ ] Intégrer le framework choisi dans le projet Vite existant.
    - [ ] Configurer le pont de communication (IPC) entre le frontend React et le backend Rust (Tauri) ou Node.js (Electron). C'est crucial pour les phases suivantes.
    - [ ] Mettre en place le script de build pour générer un exécutable .exe et un installeur .msi pour Windows.
    - Modèle : ottercra/Compile-OtterCra.ps1 pour l'inspiration sur le processus de build.

## 🔌 Phase 2 : Développement des Connecteurs de Données
Objectif : Implémenter la logique pour collecter les données brutes depuis les sources de l'utilisateur.
- [ ] Connecteur Natif Outlook
  - Description : Lire les emails et événements du calendrier via l'interface COM de Windows.
  - Détails Techniques :
    - Utiliser un module backend (Rust/Node.js) qui s'interface avec les API win32com.
    - Le frontend enverra une requête IPC pour une période donnée (startDate, endDate).
    - Le backend retournera une liste d'objets Email et Event structurés.
  - Modèle : ottercra/cra_assistant/email_analyzer.py et calendar_analyzer.py.
- [ ] Connecteur pour le Système RH (SIRH)
  - Description : Extraire les heures travaillées, congés et absences depuis le portail RH.
  - Détails Techniques :
    - URL Cible : https://sirh4you.prod.etat-ge.ch/app/foryou
    - Outil : Utiliser Playwright ou Selenium. Le backend lancera une instance de navigateur en mode headless pour se connecter et scraper les données.
  - Étapes :
    - [ ] Navigation vers la page de connexion.
    - [ ] Attente de l'authentification (peut nécessiter une gestion de SSO/MFA).
    - [ ] Navigation vers la page de résumé journalier (/demarches/mydaysummary/).
    - [ ] Boucle sur chaque jour de la période pour extraire les "H effectuées /J", les "Vacances", et autres absences.
  - Modèle : ottercra/cra_assistant/hr_connector.py.
- [ ] Lecteur de Fichiers Excel
  - Description : Lire et interpréter les fichiers Excel, notamment le CRA principal pour en extraire sa structure.
  - Détails Techniques :
    - Bibliothèque : Utiliser SheetJS ou exceljs dans le backend Node.js/Tauri.
  - Fonction 1: readTaskHierarchy (Lecteur de Structure CRA) :
    - [ ] Ouvrir le fichier ..._CRA.xlsx.
    - [ ] Parcourir la colonne des tâches (généralement la colonne A).
    - [ ] Construire un arbre de dépendances (ex: { "Projet A": ["- Tâche 1", "- Tâche 2"] }). Cette structure sera essentielle pour le prompt de l'IA.
  - Fonction 2: readTimesheet (Lecteur de feuilles de temps) :
    - [ ] Lire des fichiers Excel simples contenant des listes d'activités.
  - Modèle : ottercra/cra_assistant/cra_reader.py.

## 🤖 Phase 3 : Développement du Moteur d'Analyse et de Génération
Objectif : Mettre en place le cœur logique de l'application qui transforme les données brutes en saisies CRA.
- [ ] Moteur d'Analyse par LLM
  - Description : Envoyer les données collectées aux API LLM pour obtenir une première estimation des heures par tâche.
  - Détails Techniques :
    - Gestion des Prompts : Créer un service pour charger des fichiers prompt.txt (comme dans ottercra/prompts/).
    - Prompt Engineering : Le prompt envoyé à l'IA doit contenir :
      - Le contexte (Tu es un assistant...).
      - Les données brutes (extraits d'emails, sujets de réunions).
      - La structure de tâches valide extraite du CRA de l'utilisateur pour forcer l'IA à utiliser les bons libellés.
      - Des instructions claires pour un output au format JSON.
    - Service llmService.ts : Étendre ce service pour gérer ces appels complexes, le fallback (ex: Groq -> Gemini) et les stratégies de retry.
  - Modèle : ottercra/cra_assistant/email_analyzer.py et ottercra/prompt_loader.py.
- [ ] Module d'Équilibrage des Heures (HourBalancer)
  - Description : Fusionner les estimations, les comparer aux données RH et proposer une répartition cohérente.
  - Détails Techniques :
    - Fusion des sources : Pour une même tâche présente dans les emails et le calendrier, ne conserver que la durée la plus longue pour éviter les doublons.
    - Pondération : Si le total des heures estimées (total_estimated) dépasse le total des heures travaillées issues du SIRH (available_work_hours), appliquer un scale_factor = available_work_hours / total_estimated à chaque tâche.
    - Répartition du solde : S'il reste des heures non allouées, les ajouter à une tâche par défaut comme "- Tâches d'exploitation régulière".
    - Le module doit être une classe ou un ensemble de fonctions pures en TypeScript.
  - Modèle : ottercra/cra_assistant/hour_balancer.py.
- [ ] Injecteur de Données CRA
  - Description : Écrire les heures finales dans le fichier Excel du CRA.
  - Détails Techniques :
    - Sauvegarde : Créer une copie du fichier CRA original avant toute modification (<nom_fichier>.backup.xlsx).
    - Mapping Cellule : Implémenter une fonction qui trouve la bonne cellule en croisant la ligne de la tâche et la colonne de la date.
    - Format des heures : Les heures doivent être écrites sous forme de nombre décimal arrondi au quart d'heure le plus proche (ex: 1h15 -> 1.25). La formule est round(heures_en_float * 4) / 4.
    - L'opération doit être atomique pour éviter de laisser le fichier dans un état corrompu.
  - Modèle : ottercra/cra_assistant/cra_injector.py.

## 🖥️ Phase 4 : Interface Utilisateur de Génération
Objectif : Créer l'interface permettant à l'utilisateur de piloter le processus de génération.
- [ ] Créer un Wizard de Génération de CRA
  - Description : Un nouveau composant multi-étapes, distinct du wizard de setup.
  - Modèle : ottercra/front/src/components/CRAWizard.jsx.
  - Étapes :
    - [ ] Sélection de la Période : Calendrier pour choisir le mois et l'année.
    - [ ] Analyse : Bouton "Lancer l'analyse" qui déclenche tous les connecteurs (Phase 2) avec des indicateurs de progression.
    - [ ] Validation et Ajustement :
      - [ ] Afficher un tableau de bord des heures proposées, regroupées par tâche.
      - [ ] Montrer le total d'heures estimées vs. le total d'heures RH.
      - [ ] Permettre à l'utilisateur d'éditer manuellement chaque ligne.
      - [ ] Mettre en évidence les incohérences (dépassements, chevauchements).
    - Modèle pour cette étape : ottercra/front/src/components/ValidationStep.jsx.
    - [ ] Injection : Un bouton "Injecter dans le CRA" qui exécute l'injecteur (Phase 3) et affiche un message de succès.

## ⚙️ Phase 5 : CLI et Fonctionnalités Avancées
Objectif : Offrir une alternative en ligne de commande et améliorer la robustesse.
- [ ] Interface en Ligne de Commande (CLI)
  - Description : Permettre l'automatisation et l'utilisation par des profils techniques.
  - Détails Techniques : Utiliser une bibliothèque comme oclif ou commander.js.
  - Commandes à implémenter :
    - [ ] `ottercra generate --month 6 --year 2025`
    - [ ] `ottercra diagnose` (pour tester toutes les connexions)
    - [ ] `ottercra config set <clé> <valeur>`
  - Modèle : ottercra/ottercra/cli.py.
