#!/bin/bash

# Kubernetes MemoriA Deployment Helper for Linux/macOS

set -e

NAMESPACE="memoria"
K8S_DIR="./k8s"

print_header() {
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║        MemoriA Kubernetes Deployment Helper                   ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
}

print_usage() {
    echo "Usage: ./deploy-kubernetes.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  verify                - Run verification checks"
    echo "  create-ns             - Create namespace only"
    echo "  deploy                - Deploy all resources"
    echo "  deploy-db             - Deploy only databases"
    echo "  deploy-services       - Deploy only microservices"
    echo "  status                - Show deployment status"
    echo "  logs <service>        - Show pod logs"
    echo "  describe <resource>   - Show resource details"
    echo "  delete                - Delete all resources"
    echo "  restart               - Restart deployments"
    echo "  port-forward          - Set up port forwarding"
    echo ""
}

test_kubectl() {
    if command -v kubectl &> /dev/null; then
        return 0
    else
        return 1
    fi
}

test_cluster() {
    if kubectl cluster-info &>/dev/null; then
        return 0
    else
        return 1
    fi
}

COMMAND="${1:-help}"

case "$COMMAND" in
    verify)
        if ! test_kubectl; then
            echo "✗ kubectl is not installed"
            exit 1
        fi
        if ! test_cluster; then
            echo "✗ Kubernetes cluster is not accessible"
            echo "  Start cluster: 'minikube start' or configure kubectl"
            exit 1
        fi
        echo "Running full verification..."
        ./verify-kubernetes.sh
        ;;

    create-ns)
        echo "Creating namespace '$NAMESPACE'..."
        kubectl create namespace "$NAMESPACE" 2>/dev/null || echo "Namespace already exists"
        echo "✓ Namespace ready"
        ;;

    deploy)
        echo "Deploying all MemoriA resources..."
        
        # Create namespace
        kubectl create namespace "$NAMESPACE" 2>/dev/null || true
        
        # Deploy all
        echo ""
        echo "[1/3] Deploying database layer..."
        kubectl apply -f "$K8S_DIR/database/" -n "$NAMESPACE"
        
        echo ""
        echo "[2/3] Deploying microservices..."
        kubectl apply -f "$K8S_DIR/deployments/" -n "$NAMESPACE"
        
        echo ""
        echo "[3/3] Deploying services..."
        kubectl apply -f "$K8S_DIR/services/" -n "$NAMESPACE"
        
        echo ""
        echo "✓ Deployment initiated"
        echo "Monitor with: kubectl get pods -n $NAMESPACE -w"
        ;;

    deploy-db)
        echo "Deploying databases only..."
        kubectl create namespace "$NAMESPACE" 2>/dev/null || true
        kubectl apply -f "$K8S_DIR/database/" -n "$NAMESPACE"
        echo "✓ Databases deployed"
        ;;

    deploy-services)
        echo "Deploying microservices only..."
        kubectl create namespace "$NAMESPACE" 2>/dev/null || true
        kubectl apply -f "$K8S_DIR/deployments/" -n "$NAMESPACE"
        kubectl apply -f "$K8S_DIR/services/" -n "$NAMESPACE"
        echo "✓ Microservices deployed"
        ;;

    status)
        echo "MemoriA Deployment Status"
        echo ""
        echo "Deployments:"
        kubectl get deployments -n "$NAMESPACE" -o wide 2>/dev/null || echo "No deployments found"
        echo ""
        echo "Pods:"
        kubectl get pods -n "$NAMESPACE" -o wide 2>/dev/null || echo "No pods found"
        echo ""
        echo "Services:"
        kubectl get services -n "$NAMESPACE" -o wide 2>/dev/null || echo "No services found"
        ;;

    logs)
        SERVICE="${2:-}"
        if [ -z "$SERVICE" ]; then
            echo "Usage: ./deploy-kubernetes.sh logs [service]"
            echo "Services: gateway, eureka, user-service, planning-service, alerts-service, mysql-alerts, mysql-users"
            exit 1
        fi
        
        echo "Logs for $SERVICE..."
        case "$SERVICE" in
            gateway)
                kubectl logs -n "$NAMESPACE" -l app=memoria-gateway -f
                ;;
            eureka)
                kubectl logs -n "$NAMESPACE" -l app=eureka-server -f
                ;;
            user-service)
                kubectl logs -n "$NAMESPACE" -l app=user-service -f
                ;;
            planning-service)
                kubectl logs -n "$NAMESPACE" -l app=planning-service -f
                ;;
            alerts-service)
                kubectl logs -n "$NAMESPACE" -l app=alerts-service -f
                ;;
            mysql-alerts)
                kubectl logs -n "$NAMESPACE" mysql-alerts-0 -f
                ;;
            mysql-users)
                kubectl logs -n "$NAMESPACE" mysql-users-0 -f
                ;;
            *)
                echo "Unknown service: $SERVICE"
                exit 1
                ;;
        esac
        ;;

    describe)
        RESOURCE="${2:-}"
        if [ -z "$RESOURCE" ]; then
            echo "Usage: ./deploy-kubernetes.sh describe [resource]"
            echo "Example: ./deploy-kubernetes.sh describe gateway"
            exit 1
        fi
        
        echo "Describing $RESOURCE..."
        kubectl describe deployment -n "$NAMESPACE" "$RESOURCE" 2>/dev/null || \
        kubectl describe pod -n "$NAMESPACE" "$RESOURCE" 2>/dev/null || \
        echo "Resource not found: $RESOURCE"
        ;;

    delete)
        echo "WARNING: This will delete all MemoriA resources in Kubernetes!"
        read -p "Type 'yes' to confirm deletion: " CONFIRM
        
        if [ "$CONFIRM" = "yes" ]; then
            echo "Deleting namespace '$NAMESPACE'..."
            kubectl delete namespace "$NAMESPACE" --ignore-not-found
            echo "✓ All resources deleted"
        else
            echo "Deletion cancelled"
        fi
        ;;

    restart)
        echo "Restarting all deployments..."
        kubectl rollout restart deployment -n "$NAMESPACE"
        echo "✓ Restart initiated"
        echo "Monitor with: kubectl get deployments -n $NAMESPACE"
        ;;

    port-forward)
        echo "Setting up port forwarding..."
        echo ""
        echo "Gateway API (8888):"
        echo "  kubectl port-forward -n $NAMESPACE svc/memoria-gateway 8888:8888"
        echo ""
        echo "Eureka Server (8761):"
        echo "  kubectl port-forward -n $NAMESPACE svc/eureka-server 8761:8761"
        echo ""
        echo "Forwarding gateway..."
        kubectl port-forward -n "$NAMESPACE" svc/memoria-gateway 8888:8888
        ;;

    help|--help|-h|"")
        print_header
        print_usage
        ;;

    *)
        echo "Unknown command: $COMMAND"
        echo ""
        print_usage
        exit 1
        ;;
esac
