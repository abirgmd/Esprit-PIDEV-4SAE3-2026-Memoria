#!/bin/bash

# Kubernetes MemoriA Verification Script for Linux/macOS

set -e

NAMESPACE="${1:-memoria}"
K8S_DIR="./k8s"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        Kubernetes MemoriA Configuration Verification          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 1. Check if kubectl is available
echo "[1] Checking kubectl availability..."
if command -v kubectl &> /dev/null; then
    KUBECTL_VERSION=$(kubectl version --client --short 2>/dev/null)
    echo "✓ kubectl is installed: $KUBECTL_VERSION"
else
    echo "✗ kubectl is not installed or not in PATH"
    echo "  Install kubectl: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# 2. Check YAML files exist
echo ""
echo "[2] Verifying YAML files structure..."
YAML_FILES=(
    "$K8S_DIR/namespace.yaml"
    "$K8S_DIR/database/mysql-secret.yaml"
    "$K8S_DIR/database/mysql-alerts-deployment.yaml"
    "$K8S_DIR/database/mysql-users-deployment.yaml"
    "$K8S_DIR/deployments/eureka-deployment.yaml"
    "$K8S_DIR/deployments/gateway-deployment.yaml"
    "$K8S_DIR/deployments/planning-deployment.yaml"
    "$K8S_DIR/deployments/user-service-deployment.yaml"
    "$K8S_DIR/deployments/alerts-deployment.yaml"
    "$K8S_DIR/services/eureka-service.yaml"
    "$K8S_DIR/services/gateway-service.yaml"
    "$K8S_DIR/services/planning-service.yaml"
    "$K8S_DIR/services/user-service.yaml"
    "$K8S_DIR/services/alerts-service.yaml"
)

MISSING_FILES=0
for file in "${YAML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ MISSING: $file"
        ((MISSING_FILES++))
    fi
done

# 3. Validate YAML syntax with kubectl
echo ""
echo "[3] Validating YAML syntax with kubectl dry-run..."
for file in "${YAML_FILES[@]}"; do
    if [ -f "$file" ]; then
        if kubectl apply -f "$file" --dry-run=client --namespace="$NAMESPACE" &>/dev/null; then
            echo "✓ Valid YAML: $file"
        else
            echo "✗ Invalid YAML: $file"
        fi
    fi
done

# 4. Check current cluster context
echo ""
echo "[4] Kubernetes Cluster Status..."
if CONTEXT=$(kubectl config current-context 2>/dev/null); then
    echo "✓ Current context: $CONTEXT"
    
    # Try to get node count
    if NODES=$(kubectl get nodes -o json 2>/dev/null); then
        NODE_COUNT=$(echo "$NODES" | grep -c '"name"' || echo "unknown")
        echo "✓ Cluster is accessible"
    else
        echo "⚠ Could not retrieve nodes (may be permission issue)"
    fi
else
    echo "✗ Could not get current context (Cluster may not be running)"
fi

# 5. Check if namespace exists
echo ""
echo "[5] Checking Namespace..."
if kubectl get namespace "$NAMESPACE" &>/dev/null; then
    echo "✓ Namespace '$NAMESPACE' exists"
else
    echo "✗ Namespace '$NAMESPACE' does not exist"
    echo "  To create it, run: kubectl create namespace $NAMESPACE"
fi

# 6. Check running deployments
echo ""
echo "[6] Checking Deployments in namespace '$NAMESPACE'..."
if kubectl get deployments -n "$NAMESPACE" &>/dev/null; then
    DEPLOYMENTS=$(kubectl get deployments -n "$NAMESPACE" -o json 2>/dev/null)
    if [ -z "$DEPLOYMENTS" ] || echo "$DEPLOYMENTS" | grep -q '"items": \[\]'; then
        echo "  No deployments found (cluster may not have resources deployed yet)"
    else
        kubectl get deployments -n "$NAMESPACE" --no-headers 2>/dev/null | while read -r line; do
            echo "  $line"
        done
    fi
else
    echo "  Could not retrieve deployments"
fi

# 7. Check running services
echo ""
echo "[7] Checking Services in namespace '$NAMESPACE'..."
if kubectl get services -n "$NAMESPACE" &>/dev/null; then
    SERVICES=$(kubectl get services -n "$NAMESPACE" -o json 2>/dev/null)
    if [ -z "$SERVICES" ] || echo "$SERVICES" | grep -q '"items": \[\]'; then
        echo "  No services found"
    else
        kubectl get services -n "$NAMESPACE" --no-headers 2>/dev/null | while read -r line; do
            echo "  $line"
        done
    fi
else
    echo "  Could not retrieve services"
fi

# 8. Check running pods
echo ""
echo "[8] Checking Pods in namespace '$NAMESPACE'..."
if kubectl get pods -n "$NAMESPACE" &>/dev/null; then
    PODS=$(kubectl get pods -n "$NAMESPACE" -o json 2>/dev/null)
    if [ -z "$PODS" ] || echo "$PODS" | grep -q '"items": \[\]'; then
        echo "  No pods found (resources not deployed)"
    else
        kubectl get pods -n "$NAMESPACE" --no-headers 2>/dev/null | while read -r line; do
            echo "  $line"
        done
    fi
else
    echo "  Could not retrieve pods"
fi

# 9. Check Secrets
echo ""
echo "[9] Checking Secrets in namespace '$NAMESPACE'..."
if kubectl get secrets -n "$NAMESPACE" &>/dev/null; then
    SECRETS=$(kubectl get secrets -n "$NAMESPACE" -o json 2>/dev/null)
    if [ -z "$SECRETS" ] || echo "$SECRETS" | grep -q '"items": \[\]'; then
        echo "  No secrets found"
    else
        kubectl get secrets -n "$NAMESPACE" --no-headers 2>/dev/null | while read -r line; do
            echo "  $line"
        done
    fi
else
    echo "  Could not retrieve secrets"
fi

# 10. Summary and recommendations
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                          SUMMARY                              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ $MISSING_FILES -eq 0 ]; then
    echo "✓ All YAML files present"
else
    echo "⚠ $MISSING_FILES YAML files missing"
fi

echo ""
echo "📋 DEPLOYMENT CHECKLIST:"
echo "  To deploy all resources to your cluster, run:"
echo ""
echo "  # Create namespace"
echo "  kubectl create namespace $NAMESPACE"
echo ""
echo "  # Apply all configurations"
echo "  kubectl apply -f ./k8s/ -n $NAMESPACE"
echo ""
echo "  # Or deploy step by step:"
echo "  kubectl apply -f ./k8s/namespace.yaml"
echo "  kubectl apply -f ./k8s/database/ -n $NAMESPACE"
echo "  kubectl apply -f ./k8s/deployments/ -n $NAMESPACE"
echo "  kubectl apply -f ./k8s/services/ -n $NAMESPACE"
echo ""

echo "📊 USEFUL KUBECTL COMMANDS:"
echo "  # View deployment status"
echo "  kubectl get deployments -n $NAMESPACE -w"
echo ""
echo "  # View pod logs"
echo "  kubectl logs -n $NAMESPACE -l app=memoria-gateway --tail=100"
echo ""
echo "  # View service ports"
echo "  kubectl get services -n $NAMESPACE"
echo ""
echo "  # Port forward to a service"
echo "  kubectl port-forward -n $NAMESPACE svc/memoria-gateway 8888:8888"
echo ""

echo "✅ Verification complete!"
