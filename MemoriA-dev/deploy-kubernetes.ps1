param(
  [Parameter(ValueFromRemainingArguments=$true)]
  [string[]]$Arguments
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        MemoriA Kubernetes Deployment Helper                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`nUsage: .\deploy-kubernetes.ps1 [command]`n" -ForegroundColor Yellow

Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  verify                - Run verification checks" -ForegroundColor Green
Write-Host "  create-ns             - Create namespace only" -ForegroundColor Green
Write-Host "  deploy                - Deploy all resources" -ForegroundColor Green
Write-Host "  deploy-db             - Deploy only databases" -ForegroundColor Green
Write-Host "  deploy-services       - Deploy only microservices" -ForegroundColor Green
Write-Host "  status                - Show deployment status" -ForegroundColor Green
Write-Host "  logs                  - Show pod logs" -ForegroundColor Green
Write-Host "  describe              - Show resource details" -ForegroundColor Green
Write-Host "  delete                - Delete all resources" -ForegroundColor Green
Write-Host "  restart               - Restart deployments" -ForegroundColor Green
Write-Host "  port-forward          - Set up port forwarding" -ForegroundColor Green
Write-Host ""

$command = $Arguments[0]

function Test-Kubectl {
  try {
    kubectl version --client --short 2>$null | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Test-Cluster {
  try {
    kubectl cluster-info 2>$null | Out-Null
    return $true
  } catch {
    return $false
  }
}

switch ($command) {
  "verify" {
    if (-not (Test-Kubectl)) {
      Write-Host "✗ kubectl is not installed" -ForegroundColor Red
      exit 1
    }
    if (-not (Test-Cluster)) {
      Write-Host "✗ Kubernetes cluster is not accessible" -ForegroundColor Red
      Write-Host "  Start cluster: Docker Desktop or 'minikube start'" -ForegroundColor Yellow
      exit 1
    }
    Write-Host "Running full verification..." -ForegroundColor Cyan
    .\verify-kubernetes.ps1
  }

  "create-ns" {
    Write-Host "Creating namespace 'memoria'..." -ForegroundColor Cyan
    kubectl create namespace memoria 2>$null || Write-Host "Namespace already exists" -ForegroundColor Yellow
    Write-Host "✓ Namespace ready" -ForegroundColor Green
  }

  "deploy" {
    Write-Host "Deploying all MemoriA resources..." -ForegroundColor Cyan
    
    # Create namespace
    kubectl create namespace memoria 2>$null || $null
    
    # Deploy all
    Write-Host "`n[1/3] Deploying database layer..." -ForegroundColor Yellow
    kubectl apply -f .\k8s\database\ -n memoria
    
    Write-Host "`n[2/3] Deploying microservices..." -ForegroundColor Yellow
    kubectl apply -f .\k8s\deployments\ -n memoria
    
    Write-Host "`n[3/3] Deploying services..." -ForegroundColor Yellow
    kubectl apply -f .\k8s\services\ -n memoria
    
    Write-Host "`n✓ Deployment initiated" -ForegroundColor Green
    Write-Host "Monitor with: kubectl get pods -n memoria -w" -ForegroundColor Cyan
  }

  "deploy-db" {
    Write-Host "Deploying databases only..." -ForegroundColor Cyan
    kubectl create namespace memoria 2>$null || $null
    kubectl apply -f .\k8s\database\ -n memoria
    Write-Host "✓ Databases deployed" -ForegroundColor Green
  }

  "deploy-services" {
    Write-Host "Deploying microservices only..." -ForegroundColor Cyan
    kubectl create namespace memoria 2>$null || $null
    kubectl apply -f .\k8s\deployments\ -n memoria
    kubectl apply -f .\k8s\services\ -n memoria
    Write-Host "✓ Microservices deployed" -ForegroundColor Green
  }

  "status" {
    Write-Host "MemoriA Deployment Status`n" -ForegroundColor Cyan
    
    Write-Host "Deployments:" -ForegroundColor Yellow
    kubectl get deployments -n memoria -o wide
    
    Write-Host "`nPods:" -ForegroundColor Yellow
    kubectl get pods -n memoria -o wide
    
    Write-Host "`nServices:" -ForegroundColor Yellow
    kubectl get services -n memoria -o wide
  }

  "logs" {
    $service = $Arguments[1]
    if (-not $service) {
      Write-Host "Usage: .\deploy-kubernetes.ps1 logs [service]" -ForegroundColor Yellow
      Write-Host "Services: gateway, eureka, user-service, planning-service, alerts-service, mysql-alerts, mysql-users" -ForegroundColor Cyan
      exit 1
    }
    
    Write-Host "Logs for $service..." -ForegroundColor Cyan
    switch ($service) {
      "gateway" { kubectl logs -n memoria -l app=memoria-gateway -f }
      "eureka" { kubectl logs -n memoria -l app=eureka-server -f }
      "user-service" { kubectl logs -n memoria -l app=user-service -f }
      "planning-service" { kubectl logs -n memoria -l app=planning-service -f }
      "alerts-service" { kubectl logs -n memoria -l app=alerts-service -f }
      "mysql-alerts" { kubectl logs -n memoria mysql-alerts-0 -f }
      "mysql-users" { kubectl logs -n memoria mysql-users-0 -f }
      default { Write-Host "Unknown service: $service" -ForegroundColor Red }
    }
  }

  "describe" {
    $resource = $Arguments[1]
    if (-not $resource) {
      Write-Host "Usage: .\deploy-kubernetes.ps1 describe [resource]" -ForegroundColor Yellow
      Write-Host "Example: .\deploy-kubernetes.ps1 describe gateway" -ForegroundColor Cyan
      exit 1
    }
    
    Write-Host "Describing $resource..." -ForegroundColor Cyan
    kubectl describe deployment -n memoria $resource 2>$null || `
    kubectl describe pod -n memoria $resource 2>$null || `
    Write-Host "Resource not found: $resource" -ForegroundColor Red
  }

  "delete" {
    Write-Host "WARNING: This will delete all MemoriA resources in Kubernetes!" -ForegroundColor Red
    $confirm = Read-Host "Type 'yes' to confirm deletion"
    
    if ($confirm -eq "yes") {
      Write-Host "Deleting namespace 'memoria'..." -ForegroundColor Yellow
      kubectl delete namespace memoria -n memoria --ignore-not-found
      Write-Host "✓ All resources deleted" -ForegroundColor Green
    } else {
      Write-Host "Deletion cancelled" -ForegroundColor Yellow
    }
  }

  "restart" {
    Write-Host "Restarting all deployments..." -ForegroundColor Cyan
    kubectl rollout restart deployment -n memoria
    Write-Host "✓ Restart initiated" -ForegroundColor Green
    Write-Host "Monitor with: kubectl get deployments -n memoria" -ForegroundColor Cyan
  }

  "port-forward" {
    Write-Host "Setting up port forwarding...`n" -ForegroundColor Cyan
    
    Write-Host "Gateway API (8888):" -ForegroundColor Yellow
    Write-Host "  kubectl port-forward -n memoria svc/memoria-gateway 8888:8888" -ForegroundColor Cyan
    
    Write-Host "`nEureka Server (8761):" -ForegroundColor Yellow
    Write-Host "  kubectl port-forward -n memoria svc/eureka-server 8761:8761" -ForegroundColor Cyan
    
    Write-Host "`nForwarding gateway..." -ForegroundColor Yellow
    kubectl port-forward -n memoria svc/memoria-gateway 8888:8888
  }

  default {
    if ($command) {
      Write-Host "Unknown command: $command" -ForegroundColor Red
    }
    Write-Host "Run without arguments to see all available commands" -ForegroundColor Yellow
  }
}
