# Script de configuration de Jenkins pour Kubernetes
# À exécuter sur le serveur Jenkins (ou la machine locale)

#!/bin/bash
set -e

echo "=========================================="
echo "🔧 CONFIGURATION JENKINS POUR KUBERNETES"
echo "=========================================="
echo ""

# Déterminer le répertoire home de Jenkins
JENKINS_HOME="${JENKINS_HOME:=/var/lib/jenkins}"
JENKINS_USER="${JENKINS_USER:=jenkins}"

echo "📁 Répertoire Jenkins : ${JENKINS_HOME}"
echo "👤 Utilisateur Jenkins : ${JENKINS_USER}"
echo ""

# 1. Créer le répertoire .kube
echo "1️⃣  Création du répertoire ~/.kube..."
mkdir -p ${JENKINS_HOME}/.kube
sudo chown -R ${JENKINS_USER}:${JENKINS_USER} ${JENKINS_HOME}/.kube
echo "✅ Répertoire créé"
echo ""

# 2. Copier kubeconfig
echo "2️⃣  Copie du kubeconfig..."
echo "   Source : ~/.kube/config ou ~/.minikube/..."
echo "   Cible : ${JENKINS_HOME}/.kube/config"
echo ""

# Chercher le kubeconfig dans les emplacements standard
if [ -f ~/.kube/config ]; then
    echo "✅ Trouvé ~/.kube/config"
    sudo cp ~/.kube/config ${JENKINS_HOME}/.kube/config
elif [ -f ~/.minikube/... ]; then
    echo "✅ Trouvé ~/.minikube/..."
    sudo cp ~/.minikube/... ${JENKINS_HOME}/.kube/config
else
    echo "❌ kubeconfig non trouvé"
    echo "   Crée-le avec : kubectl config view --flatten > ~/.kube/config"
    exit 1
fi

sudo chown ${JENKINS_USER}:${JENKINS_USER} ${JENKINS_HOME}/.kube/config
sudo chmod 600 ${JENKINS_HOME}/.kube/config
echo ""

# 3. Vérifier les permissions
echo "3️⃣  Vérification des permissions..."
ls -la ${JENKINS_HOME}/.kube/
echo ""

# 4. Tester la connexion
echo "4️⃣  Test de connexion kubectl..."
sudo -u ${JENKINS_USER} kubectl get nodes
echo ""

# 5. Vérifier l'accès au namespace
echo "5️⃣  Vérification de l'accès au namespace memoria..."
sudo -u ${JENKINS_USER} kubectl get pods -n memoria
echo ""

echo "=========================================="
echo "✅ CONFIGURATION JENKINS COMPLÈTE!"
echo "=========================================="
echo ""
echo "Jenkins peut maintenant :"
echo "  - Exécuter des commandes kubectl"
echo "  - Déployer dans le namespace 'memoria'"
echo "  - Accéder à Kubernetes"
echo ""
