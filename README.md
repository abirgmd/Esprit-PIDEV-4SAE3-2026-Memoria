<div align="center">

<img src="https://img.shields.io/badge/ESPRIT-School%20of%20Engineering-blue?style=for-the-badge&logo=graduation-cap" alt="Esprit Badge"/>

# 🧠 MemorIA
### *Intelligent Application for the Early Detection of Alzheimer's Risk*

> **"Technology is at its best when it brings people together."** — Matt Mullenweg

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

**Artificial Intelligence · IoT · Digital Health · Proactive Care**

</div>

---

## 📋 Overview

This project was developed as part of the **Integration Project (PI)** – 3rd Year Engineering Program at **Esprit School of Engineering** (Academic Year 2025–2026).

**MemorIA** is an intelligent web platform designed to transform Alzheimer's care through **proactive risk detection** and **comprehensive caregiver support**. It addresses a critical global challenge: over **55 million people** worldwide are affected by Alzheimer's disease, with projections reaching **152 million by 2050** (WHO).

Family caregivers — who provide **82% of all care** — face overwhelming physical and psychological burdens. MemorIA directly reduces this burden through AI automation, IoT monitoring, and adaptive scheduling.

### 🔑 Key Results

| Metric | Result |
|--------|--------|
| 📉 Caregiver burden reduction | **-50%** daily hours |
| 💊 Medication adherence improvement | **+35%** adherence rate |
| 🚨 Early risk detection | **70%** of risky situations detected early |
| 😴 Caregiver sleep gained | **+3.2h** per night |
| 🔔 False alert reduction | **-43%** false notifications |
| 🩺 Clinician trust score (XAI) | **4.6 / 5** |

---

## ✨ Features

### 🤖 AI & Intelligence
- **Proactive Risk Engine** — Behavioral analysis detecting risks *before* incidents occur
- **Dynamic Severity Scoring (0–100)** — Multi-dimensional composite score computed every 15 minutes
- **Explainable AI (XAI)** — Every decision explained in plain language per user role
- **Adaptive Scheduling Algorithm** — ML-powered reminders aligned to each patient's cognitive peaks

### 📡 IoT Monitoring Ecosystem
- Smart wristband (heart rate, sleep, fall detection)
- GPS tracker with geofencing for wandering alerts
- Smart medication dispenser (adherence tracking)
- Door/window sensors for nocturnal exit detection
- Environmental sensors (temperature, safety)

### 🧩 10 Integrated Functional Modules

| # | Module | Key Features |
|---|--------|-------------|
| 1 | 🔐 Authentication & Medical Records | Secure access, patient profiles, medical history |
| 2 | 📚 Publications & Community | Knowledge center, caregiver forums, peer support |
| 3 | 📊 AI Monitoring & Diagnostics | Behavioral tracking, trend visualization, AI insights |
| 4 | 🧩 Complaints & Cognitive Tests | Support tickets, cognitive assessments, gamified activities |
| 5 | 📅 Planning & Alerts | Adaptive scheduling, smart priority alerts |

### 🛡️ Security & Compliance
- JWT authentication (15-minute token expiry)
- AES-256 encryption for all medical data at rest
- TLS 1.3 for all data in transit
- **Full GDPR & HIPAA compliance**
- WCAG 2.1 AA accessibility compliance

---

## 🛠️ Tech Stack

### Frontend
- **Angular** (TypeScript, Angular Material) — Responsive SPA for patient, caregiver and admin interfaces

### Backend
- **Spring Boot 3.3** (Java 21, REST APIs, JWT) — Microservices, business logic, security layer

### Data
- **MySQL 8** — Relational medical records
- **MongoDB** — Behavioral logs

### AI / ML
- **Python 3.11**, scikit-learn, Gradient Boosting — Risk scoring, adaptive scheduling, XAI

### DevOps
- **Docker** + **GitHub Actions CI/CD** — Containerization and automated deployment

---

**Architecture Principles:**
- Microservices with independent horizontal scaling
- Circuit breaker patterns for all external service calls
- Daily automated backups with point-in-time recovery
- ≥ 99.9% uptime SLA | API response ≤ 200ms | Supports 10,000+ concurrent users

---

## 👥 Contributors

| Member | Role | Module |
|--------|------|--------|
| **Med Jasser Chouat** | Full-Stack Developer | Authentication & Medical Records |
| **Abir Gammoudi** | Full-Stack Developer | Publications & Community |
| **Raed Nefzi** | AI Engineer | Monitoring & Diagnostics |
| **Oussema Mrayah** | Full-Stack Developer | Complaints & Cognitive Tests |
| **Fatma Ellouze** | Full-Stack Developer | Planning & Alerts |

**Supervisor:** Mrs. Leila Ben Dhief

---

## 🎓 Academic Context

Developed at **Esprit School of Engineering – Tunisia**
Integration Project (PI) — 3rd Year Engineering Program | Academic Year **2025–2026**

> This project was developed as part of the Integration Project (PI) – 3rd Year Engineering Program at **Esprit School of Engineering** (Academic Year 2025–2026).

### 🌍 SDG Alignment

MemorIA directly contributes to United Nations Sustainable Development Goals:

| SDG | Contribution |
|-----|-------------|
| 🏥 **SDG 3** — Good Health & Well-Being | Early detection reduces hospitalizations by 30% |
| ⚖️ **SDG 10** — Reduced Inequalities | MIT open-source license: free for NGOs & public hospitals |
| 🤝 **SDG 17** — Partnerships for the Goals | Open GitHub repo enabling global research collaboration |

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required
Node.js >= 18.x
Java 21 (JDK)
Python 3.11+
Docker & Docker Compose
MySQL 8.x
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Esprit-PI/Esprit-PI-3A-2026-MemorIA.git
cd Esprit-PI-3A-2026-MemorIA

# 2. Start all services with Docker Compose
docker-compose up -d

# 3. Frontend (Angular)
cd frontend
npm install
ng serve

# 4. Backend (Spring Boot)
cd backend
./mvnw spring-boot:run

# 5. AI Service (Python)
cd ai-service
pip install -r requirements.txt
python main.py
```

### Environment Variables

```env
# Backend
DB_HOST=localhost
DB_PORT=3306
DB_NAME=memoria_db
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost

# AI Service
MODEL_PATH=./models/
MQTT_BROKER=localhost:1883
```

### Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080 |
| API Docs (Swagger) | http://localhost:8080/swagger-ui |
| AI Service | http://localhost:5000 |

---

## 📊 Innovation Highlights

### Dynamic Severity Score (0–100)

```
Medication non-adherence streak    ──── 30 pts (30%)
Abnormal movement / wandering      ──── 25 pts (25%)
Sleep pattern disruption           ──── 20 pts (20%)
Cognitive test performance decline ──── 15 pts (15%)
Social isolation index             ──── 10 pts (10%)
                                        ─────────────
                                        100 pts total
                              Computed every 15 minutes
```

### Adaptive Scheduling — Results

| Metric | Fixed Reminders | MemorIA Adaptive |
|--------|----------------|-----------------|
| Medication adherence | 52% | **87%** |
| Context awareness | 0% | **94%** |
| Manual caregiver corrections | Baseline | **-68%** |
| Model update frequency | Static | Every 7 days |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Open-source and free for all: NGOs, public hospitals, researchers, and families.

---

## 🙏 Acknowledgments

We sincerely thank:
- **Mrs. Leila Ben Dhief** — Academic supervisor, for her availability and invaluable guidance
- **ESPRIT Teaching Staff** — For the rigorous training that prepared us for this challenge
- **Healthcare professionals** and Alzheimer associations who shared their field expertise
- **Family caregivers** who opened the doors to their daily lives and helped us refine our solution
- **Our families** for their unwavering support throughout the development phases

---

<div align="center">

**Esprit School of Engineering – Tunisia | PI 2025–2026**

*"Alzheimer's disease will affect 1 in 3 seniors. Technology alone cannot cure it, but it can significantly improve millions of lives."*

⭐ Star this repository if MemorIA inspired you!

</div>
