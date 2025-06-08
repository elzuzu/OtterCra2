# 🦦 OtterCra - Automatisation Intelligente de CRA

OtterCra est une application de bureau conçue pour automatiser la génération des Comptes Rendus d'Activité (CRA).
Elle collecte les données depuis vos sources (calendrier Outlook, feuilles de temps Excel), les analyse via une IA et génère un rapport structuré, prêt à être soumis.

L'application est entièrement conçue pour fonctionner localement sur votre machine Windows, en tirant parti des API de modèles de langage (LLM) gratuites.

## ✨ Fonctionnalités Clés

### 🚀 Wizard de Configuration Guidée

Pour garantir une prise en main simple et rapide, un assistant de configuration vous guide pas à pas lors du premier lancement.

- Profil Utilisateur: Configurez votre nom, email et trigramme.
- Connexion aux LLMs: Interface dédiée pour ajouter et valider vos clés API (Groq, Gemini, etc.).
- Validation en temps réel: Le format des clés est vérifié pendant la saisie.
- Test de connectivité automatique: Un test est lancé pour chaque clé afin de garantir son bon fonctionnement et de vérifier les quotas.
- Sources de données: Indiquez où trouver votre calendrier Outlook, vos feuilles de temps, et où sauvegarder les CRA.
- Test global: Un test final valide l'ensemble de la configuration avant de démarrer.

## 🤖 Gestion Intelligente des APIs LLM

Le cœur d'OtterCra est conçu pour être résilient et performant, même avec des services gratuits.

- Support Multi-Fournisseurs: Configurez plusieurs fournisseurs (Groq et Gemini recommandés) pour assurer la continuité du service.
- (todo) Stratégie de Basculement (Fallback): Si le fournisseur principal est en panne ou a atteint son quota, OtterCra bascule automatiquement sur le suivant.
- (todo) Stratégie de Réessai (Retry): Les erreurs réseau temporaires sont gérées avec des tentatives de réessai automatiques.

## ❤️‍🩹 Monitoring et Diagnostics

Un tableau de bord vous permet de surveiller l'état de santé de vos connexions et de diagnostiquer les problèmes.

- Dashboard de Santé: Visualisez le statut de chaque API (disponibilité, temps de réponse, quota utilisé).
- (todo) Monitoring Continu: Des vérifications sont effectuées en arrière-plan pour détecter proactivement les problèmes.
- (todo) Re-configuration Intelligente: En cas de clé API invalide ou expirée, l'application vous proposera une interface de correction ciblée sans avoir à refaire toute la configuration.

## 🖥️ Interfaces Multiples

- Interface Graphique (UI): Une interface utilisateur moderne et intuitive pour la configuration et la génération des CRA.
- (todo) Interface en Ligne de Commande (CLI): Pour les utilisateurs avancés, des commandes permettront de lancer le setup, le diagnostic ou la génération directement depuis le terminal.

## 📦 Application de Bureau

- Packaging Natif: L'application est packagée pour une installation simple et directe sur Windows (win32/x64) via un installateur.

## 🛠️ Installation & Lancement

Actuellement, le projet est en phase de développement. Pour le lancer :

```bash
# Clonez le dépôt.
git clone https://github.com/user/ottercra

# Installez les dépendances :
npm install

# Lancez l'application en mode développement :
npm run dev
```

## 🎯 État du Projet

Le projet avance conformément à la feuille de route.

- ✅ Phase 1 (Terminé): Le wizard de configuration, les services principaux, et le packaging de l'application sont finalisés. L'interface utilisateur de base pour chaque étape est en place.
- ⏳ Phase 2 (En cours): L'accent est mis sur le développement des connecteurs de données (Outlook, SIRH, Excel).
- ⏳ Phase 3 (À venir): Développement du moteur d'analyse et de génération.
- ⏳ Phase 4 (À venir): Création de l'interface utilisateur de génération.
- ⏳ Phase 5 (À venir): Implémentation de la CLI et des fonctionnalités avancées.