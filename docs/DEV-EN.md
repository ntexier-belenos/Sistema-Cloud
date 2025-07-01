# 🛡️ Sistema-Cloud: Machine Safety Analysis Platform

[![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![ISO Compliance](https://img.shields.io/badge/ISO-13849--1%20%7C%2012100%20%7C%2013849--2%20%7C%203691--4-orange.svg)](#)

## 🎯 Project Vision

**Sistema-Cloud** is a next-generation open-source cloud platform for industrial machine safety analysis. Inspired by the SISTEMA tool from IFA, it integrates artificial intelligence to revolutionize functional safety approaches.

### 🎯 Key Objectives

- **Standards Compliance**: Adherence to ISO 13849-1, ISO 12100, ISO 13849-2, and ISO 3691-4
- **Artificial Intelligence**: AI agents to guide risk analysis and component selection
- **Collaboration**: Multi-user functionality with complete traceability
- **Audit**: Automatic report generation for CE/UKCA/OSHA certifications
- **Modernity**: Modern, responsive, and accessible web interface

---

## 📦 Functional Architecture

### 1.1. 🗂️ Project Management

**Key Features:**

- **Complete Lifecycle**: Create, clone, version, archive projects
- **Enriched Metadata:**
  - Unique identifier (UUID)
  - Name, description, semantic version
  - Author(s), team, organization
  - Creation date, last modification
  - Tags and categorization
- **Advanced Collaboration:**
  - Contextual comments on elements
  - Real-time notification system
  - Access rights management (read, write, admin)
  - Visual diff tracking for changes
- **Audit and Traceability:**
  - Timestamped and signed audit logs
  - Version history with rollback
  - Electronic signatures for validation
  - Export traces for regulatory compliance

### 1.2. ⚙️ Safety Function Modeling (Performance Level)

**Layered Architecture:**

- **System Level**: Machine overview
- **Function Level**: Individual safety functions
- **Component Level**: Detailed technical elements

**Modeling Features:**

- **Guided Creation** of safety functions with templates
- **Structured Decomposition:**
  - Sensors (detection, measurement)
  - Processing logic (PLCs, relays)
  - Actuators (brakes, contactors, valves)
- **Expert Parameterization:**
  - Category selection (B, 1, 2, 3, 4) with justification
  - Automatic calculation of parameters:
    - **MTTFd** (Mean Time To dangerous Failure)
    - **DC** (Diagnostic Coverage)
    - **CCF** (Common Cause Failure)
    - **PFHd** (Probability of dangerous Failure per Hour)
  - Definition of required vs achieved PL
- **Interactive Visualization:**
  - Dynamic functional diagrams
  - Reliability graphs
  - Comparison matrices
  - Diagram import/export

### 1.3. 🤖 Contextual AI Assistant (Safety Copilot)

**AI Capabilities:**

- **Natural Understanding**: NLP analysis of descriptions in French/English
- **Expert Recommendations:**
  - Automatic suggestion of suitable ISO structures
  - Recommendation of certified components by use
  - Optimization of redundancy and diagnostics
  - Proactive detection of technical inconsistencies
- **Interactive Dialogue:**
  - Contextual Q&A on PL parameters
  - Explanation of choices and calculations in natural language
  - Suggestions for safety improvements
- **Knowledge Base:**
  - Integration of updated ISO standards
  - Lessons learned from similar projects
  - Technological watch on components

### 1.4. 🧮 Automatic Calculations & Intelligent Alerts

**Real-Time Calculation Engine:**

- **Automatic Calculation** of achieved PL according to ISO 13849-1
- **Multi-Level Alert System:**
  - 🔴 Critical: Achieved PL < Required PL
  - 🟠 Warning: Low safety margins
  - 🟡 Info: Possible optimizations
- **Advanced Simulation:**
  - Modeling of multiple failures
  - Redundancy and diagnostics analysis
  - Robustness tests with Monte Carlo methods
- **Sensitivity Analysis:**
  - Impact of component changes
  - Cost/performance optimization
  - Interactive "what-if" scenarios

### 1.5. 📚 Certified Component Library

**Rich Database:**

- **Certified Components** from major manufacturers:
  - Pilz, Sick, Schmersal, ABB, Siemens, Rockwell...
  - Validated and up-to-date technical parameters
  - Links to official documentation
- **Standardized Parameters:**
  - Component type and category
  - MTTFd, DC, CCF, β (common cause factor)
  - SIL equivalence (Safety Integrity Level)
  - Usage conditions and limits
- **Custom Management:**
  - Creation of custom components
  - Validation by internal experts
  - Optional community sharing
- **Interoperability:**
  - Import/Export of SISTEMA databases (.sdb)
  - Synchronization with manufacturer catalogs
  - REST API for third-party integrations

### 1.6. 📄 CE/UKCA Report Generation

**Automated Technical Reports:**

- **Complete Documentation:**
  - Executive summary of the analysis
  - Detailed compliance proofs (ISO 13849-1/2)
  - Technical justifications for choices
  - Design calculations and assumptions
- **Regulatory Traceability:**
  - Modification history with signatures
  - Normative references used
  - Validation by qualified experts
- **Multiple Export Formats:**
  - Professional PDF with watermark
  - JSON/YAML for automation
  - Structured XML for data exchange
- **International Compliance:**
  - CE (Europe), UKCA (UK), OSHA (USA) templates
  - Automatic adaptation to target regulations

---

## 🏗️ Technical Architecture

### 2.1. Technological Stack (Cloud-Native)

**Backend (API & Services):**

```
├── Framework: FastAPI (Python 3.11+) or Node.js + Express
├── Database: PostgreSQL 15+ (relational + JSON)
├── Cache: Redis 7+ (sessions, calculation cache)
├── File Storage: MinIO or AWS S3 (documents, exports)
├── Message Queue: RabbitMQ or Apache Kafka
└── Search Engine: Elasticsearch (component search)
```

**Frontend (User Interface):**

```
├── Framework: React 18+ with TypeScript
├── State Management: Redux Toolkit + RTK Query
├── UI Components: Material-UI or Ant Design
├── Visualization: D3.js, Cytoscape.js (diagrams)
├── Real-time: Socket.io or native WebSocket
└── PWA: Service Workers for offline mode
```

**Infrastructure & DevOps:**

```
├── Containerization: Docker + Docker Compose
├── Orchestration: Kubernetes (production)
├── CI/CD: GitHub Actions or GitLab CI
├── Monitoring: Prometheus + Grafana
├── Logs: ELK Stack (Elasticsearch, Logstash, Kibana)
└── Security: OAuth 2.0, JWT, RBAC
```

### 2.2. Integrated Artificial Intelligence

**AI Services:**

- **LLM Integration:**
  - OpenAI GPT-4 (production)
  - Azure OpenAI Service (enterprise)
  - Ollama (local deployment)
  - Anthropic Claude (alternative)
- **Specialized Models:**
  - Risk classification (custom ML)
  - Entity recognition (NER) for components
  - Collaborative recommendation (filtering)
- **Processing Pipeline:**
  - Preprocessing of functional descriptions
  - Semantic analysis and intent extraction
  - Contextual suggestion generation
  - Post-processing and technical validation

### 2.3. Security & Compliance

**Authentication & Authorization:**

- **Multi-provider OAuth 2.0:** Google, Microsoft, LDAP/AD
- **Granular RBAC:** Roles by project and organization
- **Complete Audit:** Logs of all user actions
- **Session Management:** Automatic timeout, revocation

**Data Protection:**

- **Encryption:** TLS 1.3, AES-256 (data at rest)
- **GDPR Compliance:** Consent, anonymization, deletion
- **Secure Backup:** Encryption, geo-replication
- **Pen-testing:** Regular security audits

---

## 📋 Non-Functional Requirements

### 3.1. Performance & Scalability

- **Response Time:** < 200ms for standard requests
- **Complex Calculations:** < 5s for PL with 100+ components
- **Concurrent Users:** Support for 1000+ active users
- **Availability:** 99.9% (SLA) with 24/7 monitoring
- **Elasticity:** Auto-scaling based on load

### 3.2. Compatibility & Interoperability

- **Supported Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Devices:** Desktop, tablet, mobile (responsive design)
- **Import/Export:**
  - SISTEMA (.sdb): Full read and write
  - CAD Formats: eGAN (ePlan), SolidWorks Electrical
  - Standards: IEC 61508 (SIL), ISO 26262 (ASIL)
- **REST API:** OpenAPI 3.0 for third-party integrations

### 3.3. User Experience

- **Accessibility:** WCAG 2.1 AA (contrast, keyboard navigation)
- **Internationalization:** French, English, German (extensible)
- **Offline Mode:** Project caching for disconnected work
- **Onboarding:** Interactive tutorials and example projects
- **Documentation:** User guide, API docs, videos

---

## 🚀 Development Roadmap

### Phase 1: Foundations (3-4 months)

- ✅ **Basic Architecture:** REST API, authentication
- ✅ **Project Management:** CRUD, versioning, collaboration
- ✅ **Simple Modeling:** Basic safety functions
- ✅ **PL Calculations:** Fundamental ISO 13849-1 algorithms
- ✅ **User Interface:** Dashboard, forms, navigation

### Phase 2: Intelligence & Visualization (2-3 months)

- 🔄 **AI Assistant:** LLM integration, recommendations
- 🔄 **Advanced Visualization:** Interactive diagrams, graphs
- 🔄 **Component Library:** Initial database
- 🔄 **Advanced Calculations:** Simulation, sensitivity analysis
- 🔄 **Automatic Reports:** PDF/JSON templates

### Phase 3: Compliance & Enterprise (2-3 months)

- 📋 **Extended Standards:** ISO 12100, ISO 3691-4
- 📋 **Audit & Traceability:** Signatures, complete history
- 📋 **Enhanced Security:** Pentest, certifications
- 📋 **Integrations:** SISTEMA, CAD, PLM
- 📋 **Public API:** Documentation, SDK

### Phase 4: Optimization & Extensions (continuous)

- 🎯 **Performance:** Calculation optimization
- 🎯 **Advanced ML:** Custom predictive models
- 🎯 **Native Mobile:** iOS/Android applications
- 🎯 **Marketplace:** Community components
- 🎯 **Analytics:** Dashboards for managers

---

## 🧭 User Journey Example

### Scenario: "Collaborative Robot in Logistics Warehouse"

**Step 1: Project Initialization**

```
👤 User: "I need to analyze the safety of a picking cobot"
🤖 AI: "Perfect! I'll guide you. Will your robot be near human operators?"
👤 User: "Yes, for collaborative picking"
🤖 AI: "I recommend ISO 3691-4 + ISO 13849-1. Let's create a project..."
```

**Step 2: Defining Safety Functions**

```
🤖 AI: "Automatically detected functions:
    • Emergency stop (PL=d required)
    • Speed limitation (PL=c required)
    • Human presence detection (PL=d required)"
```

**Step 3: Guided Component Selection**

```
🤖 AI: "For presence detection, I suggest:
    • Option 1: SICK nanoScan3 laser scanner (Cat.3, PLd)
    • Option 2: 3D camera + AI processing (Cat.2, PLc)
    • Option 3: Sensitive mats + barriers (Cat.3, PLd)"
```

**Step 4: Automatic Validation**

```
✅ Calculations completed:
   • Achieved PL = PLd (compliant)
   • MTTFd = 2847 years (>100 years required)
   • Estimated cost = €15,420
   • Integration time = 3-4 weeks
```

**Step 5: Technical File Generation**

```
📄 CE report automatically generated:
   • Complete risk analysis (47 pages)
   • Detailed technical justifications
   • Validated reliability calculations
   • Annotated functional diagrams
   ✅ Ready for notified audit
```

---

## 📊 Success Metrics

### Technical Metrics

- **Functional Coverage:** 100% of ISO 13849-1 calculations
- **AI Accuracy:** >95% relevant recommendations
- **Performance:** Calculation time reduced by 10x vs SISTEMA
- **Reliability:** 99.9% production availability

### Business Metrics

- **Adoption:** 1000+ projects created in the first year
- **Satisfaction:** NPS > 50 among beta users
- **Compliance:** 100% of reports accepted in CE audits
- **Ecosystem:** 50+ certified components integrated

---

## 📝 Conclusion

**Sistema-Cloud** represents a major evolution in functional safety, combining:

- **Technological Innovation:** AI, cloud, modern interfaces
- **Industry Expertise:** Strict adherence to ISO standards
- **Collaborative Approach:** Facilitated teamwork
- **Open Source Vision:** Transparency and continuous improvement

This platform aims to democratize access to advanced safety tools and accelerate the compliance of industrial machines worldwide.

---

**🔗 Useful Links:**

- [GitHub Repository](https://github.com/sistema-cloud/sistema-cloud)
- [Technical Documentation](./docs/README.md)
- [Detailed Roadmap](./ROADMAP.md)
- [Contribution Guide](./CONTRIBUTING.md)
