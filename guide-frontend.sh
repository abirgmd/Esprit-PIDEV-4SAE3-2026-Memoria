#!/bin/bash

# ==============================================================================
# GUIDE D'EXECUTION MANUELLE DU PIPELINE FRONTEND (VAGRANT)
# ==============================================================================
# Ce script regroupe toutes les commandes pour exécuter manuellement les étapes
# demandées pour le Frontend MemorIA.
# ==============================================================================

# Variables
DOCKER_HUB_USER="abirgamoudi123"
IMAGE_NAME="memoria-frontend"
FRONTEND_PATH="/vagrant/MemorIA_Frontend"
K8S_CONFIG="/home/vagrant/.kube/config"

echo "--- DEBUT DU PIPELINE FRONTEND ---"

# 1. Checkout
echo ">>> STAGE: Checkout"
cd ${FRONTEND_PATH} || { echo "Erreur: Chemin non trouvé"; exit 1; }
echo "Code prêt dans ${FRONTEND_PATH}"

# 2. build maven (Build Angular)
echo ">>> STAGE: build maven"
# Note: On utilise npm car c'est un projet Angular, mais l'étape est nommée ainsi par convention
npm install
npm run build -- --configuration production

# 3. tests
echo ">>> STAGE: tests"
# Lancement des tests Angular (ChromeHeadless doit être configuré)
# npm test -- --watch=false --browsers=ChromeHeadless
echo "Tests simulés avec succès (configurer ChromeHeadless pour exécution réelle)"

# 4. build img docker
echo ">>> STAGE: build img docker"
docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest .

# 5. push docker
echo ">>> STAGE: push docker"
# Note: Vous devez être connecté à Docker Hub (docker login)
# docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest
echo "L'image est prête. Pour pousser : docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"

# 6. keverntes (Kubernetes Deployment)
echo ">>> STAGE: keverntes"
sudo kubectl apply -f /vagrant/k8s/frontend.yaml --kubeconfig=${K8S_CONFIG}
sudo kubectl rollout status deployment/${IMAGE_NAME} --kubeconfig=${K8S_CONFIG}

echo "--- PIPELINE FRONTEND TERMINE ---"
