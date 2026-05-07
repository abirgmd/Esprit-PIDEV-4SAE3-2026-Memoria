#!/bin/bash

# Quick setup for MemoriA Kubernetes on Linux

echo "🚀 MemoriA Kubernetes Setup for Linux"
echo ""

# 1. Make scripts executable
echo "1️⃣  Making scripts executable..."
chmod +x ./verify-kubernetes.sh
chmod +x ./deploy-kubernetes.sh
echo "   ✓ Scripts are now executable"
echo ""

# 2. Check kubectl
echo "2️⃣  Checking kubectl..."
if command -v kubectl &> /dev/null; then
    KUBECTL_VERSION=$(kubectl version --client --short 2>/dev/null | tr -d ' ')
    echo "   ✓ kubectl is installed: $KUBECTL_VERSION"
else
    echo "   ✗ kubectl not found in PATH"
    echo "   Copy kubectl to /usr/local/bin or add to PATH"
    exit 1
fi
echo ""

# 3. Check if minikube is running
echo "3️⃣  Checking Kubernetes cluster..."
if kubectl cluster-info &>/dev/null; then
    CONTEXT=$(kubectl config current-context 2>/dev/null)
    echo "   ✓ Kubernetes cluster is running ($CONTEXT)"
else
    echo "   ⚠️  Kubernetes cluster not accessible"
    echo "   Start minikube with: minikube start"
    echo ""
fi
echo ""

# 4. Show quick start commands
echo "4️⃣  Quick Start Commands:"
echo ""
echo "   Verify setup:"
echo "     ./verify-kubernetes.sh"
echo ""
echo "   Deploy MemoriA:"
echo "     ./deploy-kubernetes.sh deploy"
echo ""
echo "   Check status:"
echo "     ./deploy-kubernetes.sh status"
echo ""
echo "   View logs:"
echo "     ./deploy-kubernetes.sh logs gateway"
echo ""
echo "   Port forward:"
echo "     ./deploy-kubernetes.sh port-forward"
echo ""
