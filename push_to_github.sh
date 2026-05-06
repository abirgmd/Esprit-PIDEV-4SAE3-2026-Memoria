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
# Supprime le remote origin s'il existe déjà pour éviter les erreurs
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL
echo "Remote 'origin' configuré sur $REPO_URL"

echo "--- Préparation des fichiers ---"
git add .

echo "--- Création du commit ---"
git commit -m "Push automatique de tous les fichiers du projet"

echo "--- Création de la branche $BRANCH_NAME ---"
git checkout -b $BRANCH_NAME 2>/dev/null || git checkout $BRANCH_NAME

echo "--- Envoi vers GitHub ---"
echo "Note: Si demandé, entrez votre nom d'utilisateur et votre Personal Access Token (PAT)."
git push -u origin $BRANCH_NAME

echo "--- Terminé ! ---"
