param(
  [string]$Namespace = "memoria"
)

$ErrorActionPreference = "Stop"
$k8sDir = ".\k8s"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        Kubernetes MemoriA Configuration Verification         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# 1. Check if kubectl is available
Write-Host "`n[1] Checking kubectl availability..." -ForegroundColor Yellow
try {
  $kubectlVersion = kubectl version --client --short 2>$null
  Write-Host "✓ kubectl is installed: $kubectlVersion" -ForegroundColor Green
} catch {
  Write-Host "✗ kubectl is not installed or not in PATH" -ForegroundColor Red
  Write-Host "  Install kubectl: https://kubernetes.io/docs/tasks/tools/" -ForegroundColor Yellow
}

# 2. Check YAML files exist
Write-Host "`n[2] Verifying YAML files structure..." -ForegroundColor Yellow
$yamlFiles = @(
  "$k8sDir/namespace.yaml",
  "$k8sDir/database/mysql-secret.yaml",
  "$k8sDir/database/mysql-alerts-deployment.yaml",
  "$k8sDir/database/mysql-users-deployment.yaml",
  "$k8sDir/deployments/eureka-deployment.yaml",
  "$k8sDir/deployments/gateway-deployment.yaml",
  "$k8sDir/deployments/planning-deployment.yaml",
  "$k8sDir/deployments/user-service-deployment.yaml",
  "$k8sDir/deployments/alerts-deployment.yaml",
  "$k8sDir/services/eureka-service.yaml",
  "$k8sDir/services/gateway-service.yaml",
  "$k8sDir/services/planning-service.yaml",
  "$k8sDir/services/user-service.yaml",
  "$k8sDir/services/alerts-service.yaml"
)

$missingFiles = @()
foreach ($file in $yamlFiles) {
  if (Test-Path $file) {
    Write-Host "✓ $file" -ForegroundColor Green
  } else {
    Write-Host "✗ MISSING: $file" -ForegroundColor Red
    $missingFiles += $file
  }
}

# 3. Validate YAML syntax with kubectl
Write-Host "`n[3] Validating YAML syntax with kubectl dry-run..." -ForegroundColor Yellow
foreach ($file in $yamlFiles) {
  if (Test-Path $file) {
    try {
      kubectl apply -f $file --dry-run=client --namespace=$Namespace 2>$null | Out-Null
      Write-Host "✓ Valid YAML: $file" -ForegroundColor Green
    } catch {
      Write-Host "✗ Invalid YAML: $file" -ForegroundColor Red
      Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
  }
}

# 4. Check current cluster context
Write-Host "`n[4] Kubernetes Cluster Status..." -ForegroundColor Yellow
try {
  $context = kubectl config current-context
  Write-Host "✓ Current context: $context" -ForegroundColor Green
  
  $nodes = kubectl get nodes -o json | ConvertFrom-Json
  $nodeCount = $nodes.items.Count
  Write-Host "✓ Cluster nodes: $nodeCount" -ForegroundColor Green
  
  foreach ($node in $nodes.items) {
    $nodeName = $node.metadata.name
    $status = $node.status.conditions | Where-Object { $_.type -eq "Ready" } | Select-Object -First 1
    $statusMsg = $status.status
    Write-Host "  - $nodeName : $statusMsg" -ForegroundColor Cyan
  }
} catch {
  Write-Host "✗ Could not retrieve cluster info (Cluster may not be running)" -ForegroundColor Yellow
}

# 5. Check if namespace exists
Write-Host "`n[5] Checking Namespace..." -ForegroundColor Yellow
try {
  $ns = kubectl get namespace $Namespace -o json 2>$null | ConvertFrom-Json
  Write-Host "✓ Namespace '$Namespace' exists" -ForegroundColor Green
} catch {
  Write-Host "✗ Namespace '$Namespace' does not exist" -ForegroundColor Red
  Write-Host "  To create it, run: kubectl create namespace $Namespace" -ForegroundColor Yellow
}

# 6. Check running deployments
Write-Host "`n[6] Checking Deployments in namespace '$Namespace'..." -ForegroundColor Yellow
try {
  $deployments = kubectl get deployments -n $Namespace -o json 2>$null | ConvertFrom-Json
  if ($deployments.items.Count -gt 0) {
    foreach ($deployment in $deployments.items) {
      $name = $deployment.metadata.name
      $replicas = $deployment.spec.replicas
      $ready = $deployment.status.readyReplicas ?? 0
      $status = if ($ready -eq $replicas) { "Ready" } else { "Pending" }
      $color = if ($status -eq "Ready") { "Green" } else { "Yellow" }
      Write-Host "  - $name : $ready/$replicas replicas ($status)" -ForegroundColor $color
    }
  } else {
    Write-Host "  No deployments found (cluster may not have resources deployed yet)" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  No deployments found or cluster not accessible" -ForegroundColor Yellow
}

# 7. Check running services
Write-Host "`n[7] Checking Services in namespace '$Namespace'..." -ForegroundColor Yellow
try {
  $services = kubectl get services -n $Namespace -o json 2>$null | ConvertFrom-Json
  if ($services.items.Count -gt 0) {
    foreach ($service in $services.items) {
      $name = $service.metadata.name
      $type = $service.spec.type
      $clusterIP = $service.spec.clusterIP
      $externalPort = if ($service.spec.ports) { $service.spec.ports[0].port } else { "N/A" }
      Write-Host "  - $name : Type=$type, ClusterIP=$clusterIP, Port=$externalPort" -ForegroundColor Cyan
    }
  } else {
    Write-Host "  No services found" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  Could not retrieve services" -ForegroundColor Yellow
}

# 8. Check running pods
Write-Host "`n[8] Checking Pods in namespace '$Namespace'..." -ForegroundColor Yellow
try {
  $pods = kubectl get pods -n $Namespace -o json 2>$null | ConvertFrom-Json
  if ($pods.items.Count -gt 0) {
    foreach ($pod in $pods.items) {
      $name = $pod.metadata.name
      $status = $pod.status.phase
      $ready = ($pod.status.containerStatuses | Where-Object { $_.ready } | Measure-Object).Count
      $total = $pod.status.containerStatuses.Count
      $color = if ($status -eq "Running") { "Green" } else { "Yellow" }
      Write-Host "  - $name : $status ($ready/$total ready)" -ForegroundColor $color
    }
  } else {
    Write-Host "  No pods found (resources not deployed)" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  Could not retrieve pods" -ForegroundColor Yellow
}

# 9. Check Secrets
Write-Host "`n[9] Checking Secrets in namespace '$Namespace'..." -ForegroundColor Yellow
try {
  $secrets = kubectl get secrets -n $Namespace -o json 2>$null | ConvertFrom-Json
  if ($secrets.items.Count -gt 0) {
    foreach ($secret in $secrets.items) {
      $name = $secret.metadata.name
      $type = $secret.type
      Write-Host "  - $name : Type=$type" -ForegroundColor Cyan
    }
  } else {
    Write-Host "  No secrets found" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  Could not retrieve secrets" -ForegroundColor Yellow
}

# 10. Summary and recommendations
Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                          SUMMARY                              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📋 DEPLOYMENT CHECKLIST:" -ForegroundColor Cyan
Write-Host "  To deploy all resources to your cluster, run:" -ForegroundColor Yellow
Write-Host "  " -ForegroundColor Yellow
Write-Host "  # Create namespace" -ForegroundColor Gray
Write-Host "  kubectl create namespace $Namespace" -ForegroundColor White
Write-Host "  " -ForegroundColor Yellow
Write-Host "  # Apply all configurations" -ForegroundColor Gray
Write-Host "  kubectl apply -f .\k8s\ -n $Namespace" -ForegroundColor White
Write-Host "  " -ForegroundColor Yellow
Write-Host "  # Or deploy step by step:" -ForegroundColor Gray
Write-Host "  kubectl apply -f .\k8s\namespace.yaml" -ForegroundColor White
Write-Host "  kubectl apply -f .\k8s\database\ -n $Namespace" -ForegroundColor White
Write-Host "  kubectl apply -f .\k8s\deployments\ -n $Namespace" -ForegroundColor White
Write-Host "  kubectl apply -f .\k8s\services\ -n $Namespace" -ForegroundColor White

Write-Host "`n📊 USEFUL KUBECTL COMMANDS:" -ForegroundColor Cyan
Write-Host "  # View deployment status" -ForegroundColor Gray
Write-Host "  kubectl get deployments -n $Namespace -w" -ForegroundColor White
Write-Host "  " -ForegroundColor Yellow
Write-Host "  # View pod logs" -ForegroundColor Gray
Write-Host "  kubectl logs -n $Namespace -l app=memoria-gateway --tail=100" -ForegroundColor White
Write-Host "  " -ForegroundColor Yellow
Write-Host "  # View service ports" -ForegroundColor Gray
Write-Host "  kubectl get services -n $Namespace" -ForegroundColor White
Write-Host "  " -ForegroundColor Yellow
Write-Host "  # Port forward to a service" -ForegroundColor Gray
Write-Host "  kubectl port-forward -n $Namespace svc/memoria-gateway 8888:8888" -ForegroundColor White

Write-Host "`n✅ Verification complete!" -ForegroundColor Green
