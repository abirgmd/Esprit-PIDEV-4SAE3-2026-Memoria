#!/bin/bash
set -e

# Script de démarrage complet de Minikube avec Kubernetes pour MemoriA

NAMESPACE="memoria"
MINIKUBE_CPUS=4
MINIKUBE_MEMORY=4096
MINIKUBE_DISK=20g

echo "=========================================="
echo "🚀 DÉMARRAGE DE MINIKUBE"
echo "=========================================="
echo ""

# 1. Démarrer Minikube
echo "1️⃣  Démarrage de Minikube avec Docker driver..."
minikube start --driver=docker --cpus=${MINIKUBE_CPUS} --memory=${MINIKUBE_MEMORY} --disk-size=${MINIKUBE_DISK}
echo "✅ Minikube démarré"
echo ""

# 2. Vérifier les nodes
echo "2️⃣  Vérification des nodes Kubernetes..."
kubectl get nodes
echo "✅ Nodes OK"
echo ""

# 3. Créer les répertoires hostPath
echo "3️⃣  Création des répertoires de stockage..."
mkdir -p /data/mysql /data/mysql-users /data/mysql-alerts /data/mysql-planning
echo "✅ Répertoires créés"
echo ""

# 4. Créer le namespace
echo "4️⃣  Création du namespace '${NAMESPACE}'..."
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
echo "✅ Namespace créé"
echo ""

# 5. Appliquer les PersistentVolumes
echo "5️⃣  Création des PersistentVolumes..."
kubectl apply -f MemoriA-dev/k8s/database/persistent-volume.yaml
echo "✅ PersistentVolumes créés"
echo ""

# 6. Appliquer les Secrets
echo "6️⃣  Application des Secrets MySQL..."
kubectl apply -f MemoriA-dev/k8s/database/mysql-secret.yaml
echo "✅ Secrets appliqués"
echo ""

# 7. Déployer MySQL
echo "7️⃣  Déploiement des bases de données MySQL..."
kubectl apply -f MemoriA-dev/k8s/database/mysql-alerts-deployment.yaml
kubectl apply -f MemoriA-dev/k8s/database/mysql-users-deployment.yaml
echo "📦 Deployments MySQL appliqués"

# Attendre que MySQL soit prêt
echo "⏳ Attente du démarrage de MySQL (max 2 minutes)..."
kubectl wait --for=condition=ready pod -l app=mysql-alerts -n ${NAMESPACE} --timeout=120s || echo "⚠️ MySQL Alerts timeout"
kubectl wait --for=condition=ready pod -l app=mysql-users -n ${NAMESPACE} --timeout=120s || echo "⚠️ MySQL Users timeout"
echo "✅ MySQL prêt (ou timeout)"
echo ""

# 8. Appliquer ConfigMaps
echo "8️⃣  Application des ConfigMaps..."
kubectl apply -f MemoriA-dev/k8s/deployments/app-configmap.yaml
echo "✅ ConfigMaps appliqués"
echo ""

# 9. Déployer les services Spring Boot
echo "9️⃣  Déploiement des services Spring Boot..."
kubectl apply -f MemoriA-dev/k8s/deployments/alerts-deployment.yaml
kubectl apply -f MemoriA-dev/k8s/deployments/planning-deployment.yaml
kubectl apply -f MemoriA-dev/k8s/deployments/user-service-deployment.yaml
kubectl apply -f MemoriA-dev/k8s/deployments/gateway-deployment.yaml
echo "✅ Spring Boot deployments appliqués"
echo ""

# 10. Déployer les services Kubernetes
echo "🔟 Création des Services Kubernetes..."
kubectl apply -f MemoriA-dev/k8s/services/
echo "✅ Services créés"
echo ""

# 11. Déployer le monitoring (Prometheus + Grafana)
echo "1️⃣1️⃣  Déploiement du Monitoring (Prometheus + Grafana)..."
kubectl apply -f MemoriA-dev/k8s/monitoring/
echo "✅ Monitoring déployé"
echo ""

# 12. Vérification finale
echo "1️⃣2️⃣  Vérification finale..."
echo ""
echo "=== PODS DANS LE NAMESPACE ${NAMESPACE} ==="
kubectl get pods -n ${NAMESPACE} -o wide
echo ""
echo "=== SERVICES ==="
kubectl get svc -n ${NAMESPACE}
echo ""
echo "=== PersistentVolumes ==="
kubectl get pv
echo ""
echo "=== PersistentVolumeClaims ==="
kubectl get pvc -n ${NAMESPACE}
echo ""

# 13. Afficher l'IP de Minikube
echo "=========================================="
echo "✅ DÉPLOIEMENT COMPLET RÉUSSI!"
echo "=========================================="
echo ""
echo "📌 Informations utiles:"
echo "   IP Minikube : $(minikube ip)"
echo "   Namespace : ${NAMESPACE}"
echo ""
echo "🌐 Accès aux services (via port-forward):"
echo "   kubectl port-forward svc/memoria-alerts 8092:8092 -n ${NAMESPACE}"
echo "   kubectl port-forward svc/memoria-planning 8081:8081 -n ${NAMESPACE}"
echo "   kubectl port-forward svc/memoria-user-service 8080:8080 -n ${NAMESPACE}"
echo ""
echo "📊 Accès au monitoring:"
echo "   kubectl port-forward svc/prometheus 9090:9090 -n ${NAMESPACE}"
echo "   kubectl port-forward svc/grafana 3000:3000 -n ${NAMESPACE}"
echo ""
echo "📜 Voir les logs:"
echo "   kubectl logs -f deployment/memoria-planning -n ${NAMESPACE}"
echo ""
echo "=========================================="
