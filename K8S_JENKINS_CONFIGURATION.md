# Configuration Jenkins pour Kubernetes CI/CD

## 📋 Prérequis

- Jenkins installé et accessible
- kubectl installé sur l'agent Jenkins
- Docker installé sur l'agent Jenkins
- Accès à Minikube ou cluster Kubernetes
- Credentials GitHub et Docker Hub configurées

---

## 🔧 Configuration Jenkins (Pas à Pas)

### Étape 1 : Créer les Credentials Kubernetes

**Sur l'interface Jenkins :**

1. Aller à `Manage Jenkins` → `Credentials` → `System` → `Global credentials`
2. Cliquer sur `+ Add Credentials`
3. Sélectionner `Secret file`
4. Uploader votre fichier kubeconfig
5. ID : `kubeconfig-devops`
6. Sauvegarder

**Ou en ligne de commande :**

```bash
# Copier le kubeconfig vers Jenkins
sudo cp ~/.kube/config /var/lib/jenkins/.kube/config
sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config
sudo chmod 600 /var/lib/jenkins/.kube/config

# Vérifier l'accès
sudo -u jenkins kubectl get nodes
```

---

### Étape 2 : Configurer l'Agent Jenkins

**Sur chaque agent Jenkins, exécuter :**

```bash
# Télécharger et exécuter le script de configuration
curl -O https://raw.githubusercontent.com/abirgmd/Esprit-PIDEV-4SAE3-2026-Memoria/fatma-dev/MemoriA-dev/configure-jenkins-k8s.sh
chmod +x configure-jenkins-k8s.sh
sudo ./configure-jenkins-k8s.sh
```

**Ou manuellement :**

```bash
# 1. Créer le répertoire .kube
sudo mkdir -p /var/lib/jenkins/.kube
sudo chown jenkins:jenkins /var/lib/jenkins/.kube

# 2. Copier kubeconfig
sudo cp ~/.kube/config /var/lib/jenkins/.kube/config
sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config
sudo chmod 600 /var/lib/jenkins/.kube/config

# 3. Vérifier
sudo -u jenkins kubectl get nodes
sudo -u jenkins kubectl get pods -n memoria
```

---

### Étape 3 : Vérifier les Credentials Jenkins

**Dans Jenkins UI :**

```
Manage Jenkins → Credentials → System → Global credentials
```

Vérifier les credentials existants :
- ✅ `docker-hub-credentials` (Docker Hub login)
- ✅ `github-credentials` (GitHub PAT)
- ✅ `kubeconfig-devops` (Kubernetes config)

---

### Étape 4 : Créer le Job Pipeline Planning

**Option A : Via Jenkins UI**

1. Cliquer `New Item`
2. Nom : `MemoriA-Planning-CD`
3. Sélectionner `Pipeline`
4. Cocher `Poll SCM` (optional)
5. Sous `Definition`, sélectionner `Pipeline script from SCM`
6. SCM : `Git`
7. Repository URL : `https://github.com/abirgmd/Esprit-PIDEV-4SAE3-2026-Memoria.git`
8. Branch : `fatma-dev`
9. Script path : `MemoriA-dev/MemoriA-Planning-Service/Jenkinsfile-CD`
10. Sauvegarder

**Option B : Via Jenkins CLI**

```bash
java -jar jenkins-cli.jar -s http://localhost:8080 \
  create-job MemoriA-Planning-CD < planning-cd-job.xml
```

---

## 🚀 Lancer le Pipeline

### Depuis Jenkins UI

1. Aller à `MemoriA-Planning-CD`
2. Cliquer `Build Now`
3. Observer les logs en temps réel

### Depuis Jenkins CLI

```bash
java -jar jenkins-cli.jar -s http://localhost:8080 \
  build MemoriA-Planning-CD -s
```

### Depuis Git Webhook (automatique)

```bash
# Sur GitHub repo → Settings → Webhooks
URL : http://jenkins-server:8080/github-webhook/
Events : Push events
```

---

## ✅ Vérifications Post-Déploiement

### 1. Vérifier le pipeline Jenkins

```bash
# SSH sur Jenkins
sudo tail -f /var/log/jenkins/jenkins.log

# Ou via Jenkins UI → MemoriA-Planning-CD → Console Output
```

### 2. Vérifier Kubernetes

```bash
# Vérifier les pods
kubectl get pods -n memoria

# Logs du Planning
kubectl logs -f deployment/memoria-planning -n memoria

# Events Kubernetes
kubectl get events -n memoria --sort-by=.metadata.creationTimestamp

# Services
kubectl get svc -n memoria
```

### 3. Vérifier les données

```bash
# Port-forward vers Planning
kubectl port-forward svc/memoria-planning 8081:8081 -n memoria

# Tester l'API
curl http://localhost:8081/health
curl http://localhost:8081/api/planning
```

---

## 🐛 Dépannage

### Problème : `kubectl not found`

```bash
# Sur l'agent Jenkins
which kubectl
# Si absent, installer : sudo apt-get install -y kubectl
```

### Problème : `kubeconfig not found`

```bash
# Vérifier
sudo -u jenkins cat /var/lib/jenkins/.kube/config

# Copier si absent
sudo cp ~/.kube/config /var/lib/jenkins/.kube/config
sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config
```

### Problème : Pod ne démarre pas

```bash
# Voir les events
kubectl describe pod <pod-name> -n memoria

# Voir les logs
kubectl logs <pod-name> -n memoria

# Voir les erreurs
kubectl get events -n memoria --sort-by=.metadata.creationTimestamp
```

### Problème : MySQL connection timeout

```bash
# Vérifier que MySQL est prêt
kubectl get pods -l app=mysql-users -n memoria

# Vérifier les logs MySQL
kubectl logs deployment/mysql-users -n memoria

# Attendre MySQL
kubectl wait --for=condition=ready pod -l app=mysql-users -n memoria --timeout=300s
```

---

## 📊 Commandes utiles

```bash
# Voir tous les pods
kubectl get pods -n memoria -o wide

# Voir les services
kubectl get svc -n memoria

# Voir les deployments
kubectl get deployment -n memoria

# Logs de Planning
kubectl logs -f deployment/memoria-planning -n memoria

# Shell interactif dans le pod
kubectl exec -it <pod-name> -n memoria -- /bin/bash

# Port-forward
kubectl port-forward svc/memoria-planning 8081:8081 -n memoria

# Redémarrer un deployment
kubectl rollout restart deployment/memoria-planning -n memoria

# Vérifier le status du rollout
kubectl rollout status deployment/memoria-planning -n memoria --timeout=5m

# Supprimer un deployment
kubectl delete deployment memoria-planning -n memoria

# Voir les resources utilisées
kubectl top nodes
kubectl top pods -n memoria
```

---

## 📝 Notes importantes

1. **kubeconfig** : Doit être accessible à l'utilisateur Jenkins (`/var/lib/jenkins/.kube/config`)
2. **Permissions** : Jenkins user doit avoir les droits sur le kubeconfig
3. **kubectl version** : Doit être compatible avec le serveur Kubernetes
4. **Docker credentials** : Pour accéder à Docker Hub (`fatmaellouze03/...`)
5. **GitHub credentials** : Pour accéder au repo
6. **Namespace** : Les manifests créent automatiquement le namespace `memoria`

---

## 🔄 Pipeline Complet (Flux)

```
Git Checkout
    ↓
Docker Pull (últime image)
    ↓
Kubectl Apply (K8s manifests) :
    - Namespace ✅
    - PersistentVolumes ✅
    - Secrets ✅
    - ConfigMaps ✅
    - MySQL ✅
    - Planning Deployment ✅
    - Planning Service ✅
    ↓
Vérifier Pod Ready
    ↓
Smoke Test (logs, status)
    ↓
✅ SUCCESS ou ❌ FAILURE
```

---

Maintenant que Jenkins est configuré, le pipeline se déclenchera automatiquement à chaque push sur la branche `fatma-dev` !
