#!/bin/bash

# Configuration
REPO_URL="https://github.com/abirgmd/Esprit-PIDEV-4SAE3-2026-Memoria.git"
BRANCH_NAME="main-push"

echo "--- Initialisation de Git ---"
if [ ! -d ".git" ]; then
    git init
    echo "Dépôt Git initialisé."
else
    echo "Dépôt Git déjà existant."
fi

echo "--- Configuration du remote ---"
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL
echo "Remote 'origin' configuré sur $REPO_URL"

echo "--- Préparation des fichiers (Nettoyage inclus) ---"
git add -A # Prend en compte les ajouts, modifications ET suppressions
git rm --cached guide-frontend.sh cleanup_k8s.ps1 --ignore-unmatch 2>/dev/null
echo "Fichiers temporaires exclus du suivi."

echo "--- Création du commit ---"
git commit -m "Nettoyage et organisation de la structure Kubernetes"

echo "--- Préparation de la branche $BRANCH_NAME ---"
git checkout -B $BRANCH_NAME

echo "--- Envoi FORCÉ vers GitHub (Remplace le contenu distant) ---"
git push -u origin $BRANCH_NAME --force

echo "--- Terminé ! La branche $BRANCH_NAME est à jour. ---"
