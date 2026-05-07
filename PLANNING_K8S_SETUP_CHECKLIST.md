# 📋 Checklist Intégration Kubernetes pour Planning

## ✅ Fichiers Créés

### 1. **persistent-volume.yaml** 
📁 `MemoriA-dev/k8s/database/persistent-volume.yaml`
- PersistentVolume MySQL (4 instances)
- StorageClass: standard
- AccessMode: ReadWriteOnce
- Taille: 2Gi chacun
- HostPath: /data/mysql*, /data/mysql-users, etc.

### 2. **app-configmap.yaml**
📁 `MemoriA-dev/k8s/deployments/app-configmap.yaml`
- ConfigMap pour configurations Spring Boot
- URLs des BD MySQL
- Paramètres JPA/Hibernate
- Configuration Eureka Registry
- Logging configuration

### 3. **Jenkinsfile-CD (Planning)**
📁 `MemoriA-dev/MemoriA-Planning-Service/Jenkinsfile-CD`
- ✅ Checkout (Git)
- ✅ Pull Image (Docker Hub)
- ✅ Deploy Kubernetes (6 étapes ordonnées)
- ✅ Verify Pod (Rollout Status)
- ✅ Smoke Test (Pods + Services)

**Étapes Kubernetes appliquées dans l'ordre :**
1. Namespace création
2. PersistentVolumes création
3. Secrets application
4. ConfigMaps application
5. MySQL deployment
6. Planning deployment + service

### 4. **start-minikube.sh**
📁 `MemoriA-dev/start-minikube.sh`
- Script complet de démarrage
- 12 étapes de configuration
- Crée directories, PV, Secrets, ConfigMaps
- Déploie tous les services
- Déploie le monitoring (Prometheus + Grafana)
- Affiche les commandes post-déploiement

### 5. **configure-jenkins-k8s.sh**
📁 `MemoriA-dev/configure-jenkins-k8s.sh`
- Script de configuration Jenkins
- Crée /var/lib/jenkins/.kube
- Copie kubeconfig
- Teste l'accès kubectl
- Configure les permissions

### 6. **K8S_JENKINS_CONFIGURATION.md**
📁 `K8S_JENKINS_CONFIGURATION.md`
- Guide complet Jenkins + K8s
- Configuration Credentials
- Création du job Pipeline
- Vérifications post-déploiement
- Commandes de dépannage

---

## 🚀 Mise en place pas à pas

### Étape 1️⃣ : Démarrer Minikube

```bash
cd MemoriA-dev
chmod +x start-minikube.sh
./start-minikube.sh
```

**Résultat attendu :**
- ✅ Minikube démarré
- ✅ Namespace `memoria` créé
- ✅ PersistentVolumes créés
- ✅ Secrets appliqués
- ✅ ConfigMaps appliqués
- ✅ MySQL déployé et prêt
- ✅ Planning deployé et accessible
- ✅ Services disponibles

---

### Étape 2️⃣ : Configurer Jenkins

**Sur la machine Jenkins :**

```bash
# Option A : Automatique
cd MemoriA-dev
chmod +x configure-jenkins-k8s.sh
sudo ./configure-jenkins-k8s.sh

# Option B : Manuel (voir K8S_JENKINS_CONFIGURATION.md)
```

**Vérification :**

```bash
sudo -u jenkins kubectl get nodes
sudo -u jenkins kubectl get pods -n memoria
```

---

### Étape 3️⃣ : Créer le Job Jenkins

Voir **K8S_JENKINS_CONFIGURATION.md** → "Créer le Job Pipeline Planning"

**Résultat :**
- Job `MemoriA-Planning-CD` créé
- Linked à Jenkinsfile-CD du Planning
- Credentials configurées (Docker Hub, GitHub, kubeconfig)

---

### Étape 4️⃣ : Lancer le Pipeline

**Via Jenkins UI :**
- Aller à `MemoriA-Planning-CD`
- Cliquer `Build Now`
- Observer les logs en temps réel

**Résultat :**
- ✅ Image Docker pulée
- ✅ Manifests K8s appliqués
- ✅ Planning déployé
- ✅ Pod en état Ready

---

### Étape 5️⃣ : Vérifier le Déploiement

```bash
# Pods
kubectl get pods -n memoria

# Logs Planning
kubectl logs -f deployment/memoria-planning -n memoria

# Services
kubectl get svc -n memoria

# Port-forward (test local)
kubectl port-forward svc/memoria-planning 8081:8081 -n memoria

# Test API
curl http://localhost:8081/health
```

---

## 📊 Architecture Déployée

```
┌─────────────────────────────────────────────┐
│           Minikube Kubernetes               │
├─────────────────────────────────────────────┤
│ Namespace: memoria                          │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Storage Layer (PersistentVolumes)     │  │
│  │ - mysql-users-pv (2Gi)                │  │
│  │ - mysql-planning-pv (2Gi)             │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Configuration (ConfigMaps + Secrets)  │  │
│  │ - spring-datasource-config            │  │
│  │ - mysql-secret                        │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Database Layer                        │  │
│  │ ┌─────────────────────────────────┐   │  │
│  │ │ mysql-users (users_db)          │   │  │
│  │ │ Port: 3306                      │   │  │
│  │ │ Storage: mysql-users-pvc        │   │  │
│  │ └─────────────────────────────────┘   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Application Layer                     │  │
│  │ ┌─────────────────────────────────┐   │  │
│  │ │ memoria-planning (2 replicas)   │   │  │
│  │ │ Port: 8081                      │   │  │
│  │ │ Image: fatmaellouze03/...       │   │  │
│  │ │ Env: ConfigMap + Secrets        │   │  │
│  │ └─────────────────────────────────┘   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Service Layer (ClusterIP)             │  │
│  │ - memoria-planning:8081               │  │
│  │ - mysql-users:3306                    │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
         ↑
         │ kubectl apply (from Jenkins)
         │
    Jenkins Pipeline (CD)
```

---

## 📝 Variables d'Environnement Planning

Planning utilise ces variables (définies dans app-configmap.yaml) :

```yaml
SPRING_DATASOURCE_URL: jdbc:mysql://mysql-users:3306/users_db?...
SPRING_DATASOURCE_USERNAME: appuser (from Secret)
SPRING_DATASOURCE_PASSWORD: apppassword (from Secret)

SPRING_JPA_HIBERNATE_DDL_AUTO: update
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
```

---

## 🔍 Fichiers de Manifests Utilisés

```
MemoriA-dev/k8s/
├── database/
│   ├── persistent-volume.yaml ✅ (CRÉÉ)
│   ├── mysql-secret.yaml ✅ (EXISTANT)
│   └── mysql-users-deployment.yaml ✅ (EXISTANT)
├── deployments/
│   ├── app-configmap.yaml ✅ (CRÉÉ)
│   └── planning-deployment.yaml ✅ (EXISTANT)
├── services/
│   └── planning-service.yaml ✅ (EXISTANT)
└── namespace.yaml ✅ (EXISTANT)
```

---

## ⚠️ Points d'attention

1. **kubeconfig** - Doit être accessible à Jenkins user
2. **Docker Registry** - Planning tire l'image depuis Docker Hub
3. **Network Policy** - Aucune policy restrictive (pod-to-pod OK)
4. **Storage** - `/data/mysql*` doit exister sur Minikube
5. **Database init** - MySQL crée automatiquement les tables
6. **Logs** - À vérifier avec `kubectl logs` si problème

---

## 🧪 Test Complet

```bash
# 1. Démarrer Minikube
cd MemoriA-dev
./start-minikube.sh

# 2. Vérifier le déploiement
kubectl get pods -n memoria

# 3. Port-forward
kubectl port-forward svc/memoria-planning 8081:8081 -n memoria

# 4. Tester l'API
curl http://localhost:8081/health
curl http://localhost:8081/api/planning

# 5. Voir les logs
kubectl logs -f deployment/memoria-planning -n memoria

# 6. Arrêter
minikube stop
```

---

## 📞 Support

En cas de problème, consulter :
1. `K8S_JENKINS_CONFIGURATION.md` → Dépannage
2. `kubectl get events -n memoria --sort-by=.metadata.creationTimestamp`
3. `kubectl describe pod <pod-name> -n memoria`
4. `kubectl logs <pod-name> -n memoria`

---

✅ **INTÉGRATION COMPLÈTE POUR PLANNING** 🎉
