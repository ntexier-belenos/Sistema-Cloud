# 🛡️ Sistema-Cloud : Plateforme d'Analyse de Sécurité Machine

[![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![ISO Compliance](https://img.shields.io/badge/ISO-13849--1%20%7C%2012100%20%7C%2013849--2%20%7C%203691--4-orange.svg)](#)

## 🎯 Vision du Projet

**Sistema-Cloud** est une plateforme cloud open source de nouvelle génération pour l'analyse de sécurité des machines industrielles. Inspirée de l'outil SISTEMA de l'IFA, elle intègre l'intelligence artificielle pour révolutionner l'approche de la sécurité fonctionnelle.

### 🎯 Objectifs principaux

- **Conformité normative** : Respect des standards ISO 13849-1, ISO 12100, ISO 13849-2 et ISO 3691-4
- **Intelligence artificielle** : Agents IA pour guider l'analyse de risques et la sélection de composants
- **Collaboration** : Fonctionnement multi-utilisateur avec traçabilité complète
- **Audit** : Génération automatique de rapports pour les certifications CE/UKCA/OSHA
- **Modernité** : Interface web moderne, responsive et accessible

---

## 📦 Architecture Fonctionnelle

### 1.1. 🗂️ Gestion de Projet

**Fonctionnalités principales :**
- **Cycle de vie complet** : Création, clonage, versioning, archivage de projets
- **Métadonnées enrichies** : 
  - Identifiant unique (UUID)
  - Nom, description, version sémantique
  - Auteur(s), équipe, organisation
  - Date de création, dernière modification
  - Tags et catégorisation
- **Collaboration avancée** :
  - Commentaires contextuels sur les éléments
  - Système de notifications en temps réel
  - Gestion des droits d'accès (lecture, écriture, admin)
  - Suivi des modifications avec diff visuel
- **Audit et traçabilité** :
  - Journal d'audit horodaté et signé
  - Historique des versions avec rollback
  - Signatures électroniques pour validation
  - Export des traces pour conformité réglementaire

### 1.2. ⚙️ Modélisation des Fonctions de Sécurité (Performance Level)

**Architecture en couches :**
- **Niveau système** : Vue d'ensemble de la machine
- **Niveau fonction** : Fonctions de sécurité individuelles
- **Niveau composant** : Éléments techniques détaillés

**Fonctionnalités de modélisation :**
- **Création guidée** de fonctions de sécurité avec templates
- **Décomposition structurée** :
  - Capteurs (détection, mesure)
  - Logique de traitement (automates, relais)
  - Actionneurs (freins, contacteurs, valves)
- **Paramétrage expert** :
  - Sélection de catégorie (B, 1, 2, 3, 4) avec justification
  - Calcul automatique des paramètres :
    - **MTTFd** (Mean Time To dangerous Failure)
    - **DC** (Diagnostic Coverage)
    - **CCF** (Common Cause Failure)
    - **PFHd** (Probability of dangerous Failure per Hour)
  - Définition du PL requis vs PL atteint
- **Visualisation interactive** :
  - Schémas fonctionnels dynamiques
  - Graphiques de fiabilité
  - Matrices de comparaison
  - Import/Export de diagrammes

### 1.3. 🤖 Assistant IA Contextuel (Copilote Sécurité)

**Capacités d'intelligence artificielle :**
- **Compréhension naturelle** : Analyse NLP des descriptions en français/anglais
- **Recommandations expertes** :
  - Suggestion automatique de structures ISO adaptées
  - Recommandation de composants certifiés par usage
  - Optimisation du niveau de redondance et diagnostic
  - Détection proactive d'incohérences techniques
- **Dialogue interactif** :
  - Questions/réponses contextuelles sur les paramètres PL
  - Explication des choix et calculs en langage naturel
  - Suggestions d'amélioration de la sécurité
- **Base de connaissances** :
  - Intégration des normes ISO actualisées
  - Retours d'expérience de projets similaires
  - Veille technologique sur les composants

### 1.4. 🧮 Calculs Automatiques & Alertes Intelligentes

**Moteur de calcul temps réel :**
- **Calcul automatique** du PL atteint selon ISO 13849-1
- **Système d'alertes** multiniveau :
  - 🔴 Critique : PL atteint < PL requis
  - 🟠 Attention : Marges de sécurité faibles
  - 🟡 Information : Optimisations possibles
- **Simulation avancée** :
  - Modélisation de pannes multiples
  - Analyse de redondance et diagnostics
  - Tests de robustesse avec méthodes Monte Carlo
- **Analyse de sensibilité** :
  - Impact du changement de composants
  - Optimisation coût/performance
  - Scénarios "what-if" interactifs

### 1.5. 📚 Bibliothèque de Composants Certifiés

**Base de données riche :**
- **Composants certifiés** par les principaux constructeurs :
  - Pilz, Sick, Schmersal, ABB, Siemens, Rockwell...
  - Paramètres techniques validés et à jour
  - Liens vers documentation officielle
- **Paramètres normalisés** :
  - Type et catégorie de composant
  - MTTFd, DC, CCF, β (common cause factor)
  - Équivalence SIL (Safety Integrity Level)
  - Conditions d'utilisation et limites
- **Gestion personnalisée** :
  - Création de composants sur-mesure
  - Validation par experts internes
  - Partage communautaire (optionnel)
- **Interopérabilité** :
  - Import/Export de bases SISTEMA (.sdb)
  - Synchronisation avec catalogues constructeurs
  - API REST pour intégrations tierces

### 1.6. 📄 Génération de Rapports CE/UKCA

**Rapports techniques automatisés :**
- **Documentation complète** :
  - Résumé exécutif de l'analyse
  - Preuves de conformité détaillées (ISO 13849-1/2)
  - Justifications techniques des choix
  - Calculs et hypothèses de conception
- **Traçabilité réglementaire** :
  - Historique des modifications avec signatures
  - Références normatives utilisées
  - Validation par experts qualifiés
- **Formats d'export multiples** :
  - PDF professionnel avec watermark
  - JSON/YAML pour automatisation
  - XML structuré pour échange de données
- **Conformité internationale** :
  - Templates CE (Europe), UKCA (UK), OSHA (USA)
  - Adaptation automatique selon la réglementation cible

---

## 🏗️ Architecture Technique

### 2.1. Stack Technologique (Cloud-Native)

**Backend (API & Services) :**
```
├── Framework : FastAPI (Python 3.11+) ou Node.js + Express
├── Base de données : PostgreSQL 15+ (relationnel + JSON)
├── Cache : Redis 7+ (sessions, cache calculs)
├── File Storage : MinIO ou AWS S3 (documents, exports)
├── Message Queue : RabbitMQ ou Apache Kafka
└── Search Engine : Elasticsearch (recherche composants)
```

**Frontend (Interface Utilisateur) :**
```
├── Framework : React 18+ avec TypeScript
├── State Management : Redux Toolkit + RTK Query
├── UI Components : Material-UI ou Ant Design
├── Visualisation : D3.js, Cytoscape.js (schémas)
├── Real-time : Socket.io ou WebSocket native
└── PWA : Service Workers pour mode offline
```

**Infrastructure & DevOps :**
```
├── Conteneurisation : Docker + Docker Compose
├── Orchestration : Kubernetes (production)
├── CI/CD : GitHub Actions ou GitLab CI
├── Monitoring : Prometheus + Grafana
├── Logs : ELK Stack (Elasticsearch, Logstash, Kibana)
└── Security : OAuth 2.0, JWT, RBAC
```

### 2.2. Intelligence Artificielle Intégrée

**Services IA :**
- **LLM Integration** :
  - OpenAI GPT-4 (production)
  - Azure OpenAI Service (entreprise)
  - Ollama (déploiement local)
  - Anthropic Claude (alternative)
- **Modèles spécialisés** :
  - Classification de risques (ML custom)
  - Reconnaissance d'entités (NER) pour composants
  - Recommandation collaborative (filtrage)
- **Pipeline de traitement** :
  - Preprocessing des descriptions fonctionnelles
  - Analyse sémantique et extraction d'intentions
  - Génération de suggestions contextuelles
  - Post-processing et validation technique

### 2.3. Sécurité & Conformité

**Authentification & Autorisation :**
- **Multi-provider OAuth 2.0** : Google, Microsoft, LDAP/AD
- **RBAC granulaire** : Rôles par projet et organisation
- **Audit complet** : Logs de toutes les actions utilisateur
- **Session management** : Timeout automatique, révocation

**Protection des données :**
- **Chiffrement** : TLS 1.3, AES-256 (data at rest)
- **RGPD compliance** : Consentement, anonymisation, suppression
- **Backup sécurisé** : Chiffrement, géo-réplication
- **Pen-testing** : Audits de sécurité réguliers

---

## 📋 Exigences Non Fonctionnelles

### 3.1. Performance & Scalabilité

- **Temps de réponse** : < 200ms pour les requêtes standards
- **Calculs complexes** : < 5s pour PL avec 100+ composants
- **Utilisateurs simultanés** : Support de 1000+ utilisateurs actifs
- **Disponibilité** : 99.9% (SLA) avec monitoring 24/7
- **Élasticité** : Auto-scaling selon la charge

### 3.2. Compatibilité & Interopérabilité

- **Navigateurs supportés** : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Devices** : Desktop, tablette, mobile (responsive design)
- **Import/Export** :
  - SISTEMA (.sdb) : Lecture et écriture complète
  - Formats CAO : eGAN (ePlan), SolidWorks Electrical
  - Standards : IEC 61508 (SIL), ISO 26262 (ASIL)
- **API REST** : OpenAPI 3.0 pour intégrations tierces

### 3.3. Expérience Utilisateur

- **Accessibilité** : WCAG 2.1 AA (contraste, navigation clavier)
- **Internationalisation** : Français, anglais, allemand (extensible)
- **Mode offline** : Cache des projets pour travail déconnecté
- **Onboarding** : Tutoriels interactifs et projets exemples
- **Documentation** : Guide utilisateur, API docs, vidéos

---

## 🚀 Roadmap de Développement

### Phase 1 : Fondations (3-4 mois)
- ✅ **Architecture de base** : API REST, authentification
- ✅ **Gestion de projets** : CRUD, versioning, collaboration
- ✅ **Modélisation simple** : Fonctions de sécurité de base
- ✅ **Calculs PL** : Algorithmes ISO 13849-1 fondamentaux
- ✅ **Interface utilisateur** : Dashboard, formulaires, navigation

### Phase 2 : Intelligence & Visualisation (2-3 mois)
- 🔄 **Assistant IA** : Intégration LLM, recommandations
- 🔄 **Visualisation avancée** : Schémas interactifs, graphiques
- 🔄 **Bibliothèque composants** : Base de données initiale
- 🔄 **Calculs avancés** : Simulation, analyse de sensibilité
- 🔄 **Rapports automatiques** : Templates PDF/JSON

### Phase 3 : Conformité & Enterprise (2-3 mois)
- 📋 **Normes étendues** : ISO 12100, ISO 3691-4
- 📋 **Audit & traçabilité** : Signatures, historique complet
- 📋 **Sécurité renforcée** : Pentest, certifications
- 📋 **Intégrations** : SISTEMA, CAO, PLM
- 📋 **API publique** : Documentation, SDK

### Phase 4 : Optimisation & Extensions (en continu)
- 🎯 **Performance** : Optimisation des calculs
- 🎯 **ML avancé** : Modèles prédictifs personnalisés
- 🎯 **Mobile native** : Applications iOS/Android
- 🎯 **Marketplace** : Composants communautaires
- 🎯 **Analytics** : Tableaux de bord pour managers

---

## 🧭 Exemple de Parcours Utilisateur

### Scénario : "Robot collaboratif en entrepôt logistique"

**Étape 1 : Initialisation du projet**
```
👤 Utilisateur : "Je dois analyser la sécurité d'un cobot de picking"
🤖 IA : "Parfait ! Je vais vous guider. Votre robot sera-t-il proche d'opérateurs humains ?"
👤 Utilisateur : "Oui, pour du picking collaboratif"
🤖 IA : "Je recommande l'ISO 3691-4 + ISO 13849-1. Créons un projet..."
```

**Étape 2 : Définition des fonctions de sécurité**
```
🤖 IA : "Fonctions détectées automatiquement :
    • Arrêt d'urgence (PL=d requis)
    • Limitation de vitesse (PL=c requis)  
    • Détection de présence humaine (PL=d requis)"
```

**Étape 3 : Sélection guidée des composants**
```
🤖 IA : "Pour la détection de présence, je suggère :
    • Option 1: Scanner laser SICK nanoScan3 (Cat.3, PLd)
    • Option 2: Caméra 3D + traitement IA (Cat.2, PLc)
    • Option 3: Tapis sensibles + barrières (Cat.3, PLd)"
```

**Étape 4 : Validation automatique**
```
✅ Calculs terminés :
   • PL atteint = PLd (conforme)
   • MTTFd = 2847 ans (>100 ans requis)  
   • Coût estimé = 15,420€
   • Temps d'intégration = 3-4 semaines
```

**Étape 5 : Génération du dossier technique**
```
📄 Rapport CE généré automatiquement :
   • Analyse de risques complète (47 pages)
   • Justifications techniques détaillées
   • Calculs de fiabilité validés
   • Schémas fonctionnels annotés
   ✅ Prêt pour audit notifié
```

---

## 📊 Indicateurs de Succès

### Métriques Techniques
- **Couverture fonctionnelle** : 100% des calculs ISO 13849-1
- **Précision IA** : >95% de recommandations pertinentes
- **Performance** : Temps de calcul divisé par 10 vs SISTEMA
- **Fiabilité** : 99.9% de disponibilité en production

### Métriques Business
- **Adoption** : 1000+ projets créés la première année
- **Satisfaction** : NPS > 50 auprès des utilisateurs beta
- **Conformité** : 100% des rapports acceptés en audit CE
- **Écosystème** : 50+ composants certifiés intégrés

---

## 📝 Conclusion

**Sistema-Cloud** représente une évolution majeure dans le domaine de la sécurité fonctionnelle, combinant :

- **Innovation technologique** : IA, cloud, interfaces modernes
- **Expertise métier** : Respect strict des normes ISO
- **Approche collaborative** : Travail d'équipe facilité
- **Vision open source** : Transparence et amélioration continue

Cette plateforme ambitionne de démocratiser l'accès aux outils de sécurité avancés et d'accélérer la mise en conformité des machines industrielles à l'échelle mondiale.

---

**🔗 Liens utiles :**
- [Repository GitHub](https://github.com/sistema-cloud/sistema-cloud)
- [Documentation technique](./docs/README.md)
- [Roadmap détaillée](./ROADMAP.md)
- [Guide de contribution](./CONTRIBUTING.md)
