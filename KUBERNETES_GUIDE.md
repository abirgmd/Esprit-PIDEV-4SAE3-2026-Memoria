# Kubernetes MemoriA Configuration Overview

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MemoriA Namespace                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Gateway (API Entry Point)                │  │
│  │  Service: memoria-gateway (NodePort 30888)            │  │
│  │  Container Port: 8888                                │  │
│  │  Image: fatmaellouze03/memoria-gateway:latest        │  │
│  └────────────────────────────────────────────────────────┘  │
│         │                                                     │
│         ├─────────────────────────────────────────────────┐  │
│         │                                                  │  │
│  ┌──────▼─────────────┐  ┌──────────────────┐  ┌────────▼──┐ │
│  │   Eureka Server    │  │   User Service   │  │   Planning│ │
│  │  (Service Registry)│  │  (User CRUD)     │  │  Service  │ │
│  │  Port: 8761        │  │  Port: 8081      │  │  Port: 8082
│  │                    │  │                  │  │           │ │
│  └────────────────────┘  └──────────────────┘  └───────────┘ │
│         │                                              │      │
│         │                                              │      │
│  ┌──────▼─────────────────────────────────────────────▼────┐ │
│  │           Alerts Service                            │  │
│  │           (Alert Management)                        │  │
│  │           Port: 8083                                │  │
│  └───────────────────────────────────────────────────────┘ │
│         │                                                    │
│         └─────────────────────────────────────────────┐    │
│                                                       │    │
│  ┌──────────────────────────────────────────────────▼──┐  │
│  │              Database Layer                         │  │
│  │  ├─ MySQL Alerts DB (Deployment)                   │  │
│  │  ├─ MySQL Users DB (Deployment)                    │  │
│  │  └─ Secrets (DB Credentials)                       │  │
│  └────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components Overview

### 1. **Namespace**
- **Name:** `memoria`
- **Purpose:** Isolates all MemoriA resources from other workloads

### 2. **Services**
| Service | Type | Port | NodePort | Purpose |
|---------|------|------|----------|---------|
| memoria-gateway | NodePort | 8888 | 30888 | API Gateway entry point |
| eureka-server | ClusterIP | 8761 | - | Service discovery/registry |
| user-service | ClusterIP | 8081 | - | User management microservice |
| planning-service | ClusterIP | 8082 | - | Planning microservice |
| alerts-service | ClusterIP | 8083 | - | Alerts microservice |

### 3. **Deployments**
| Deployment | Replicas | Image | Memory | CPU |
|------------|----------|-------|--------|-----|
| memoria-gateway | 1 | fatmaellouze03/memoria-gateway:latest | 256Mi | 300m |
| eureka-server | 1 | eureka:latest | 256Mi | 300m |
| user-service | 1 | memoria-user-service:latest | 256Mi | 300m |
| planning-service | 1 | memoria-planning-service:latest | 256Mi | 300m |
| alerts-service | 1 | memoria-alerts-service:latest | 256Mi | 300m |
| mysql-alerts | 1 | mysql:8.0 | 256Mi | 300m |
| mysql-users | 1 | mysql:8.0 | 256Mi | 300m |

### 4. **Database Configuration**
- **MySQL Alerts**: Database for alerts functionality
- **MySQL Users**: Database for user management
- **Credentials Storage**: Kubernetes Secret `mysql-secret`

### 5. **Secrets (Kubernetes)**
```yaml
mysql-secret:
  - root-password: rootpass
  - username: appuser
  - password: apppassword
  - jwt-secret: MySecretKeyForJWTTokenGenerationAndValidation12345
  - twilio-account-sid: (empty - to be configured)
  - twilio-auth-token: (empty - to be configured)
  - twilio-phone-number: (empty - to be configured)
```

## Deployment Steps

### Prerequisites
1. Kubernetes cluster running (Docker Desktop, Minikube, or cloud provider)
2. kubectl CLI installed and configured
3. Images available on Docker Hub or local registry

### Quick Deploy
```powershell
# Navigate to the project directory
cd MemoriA-dev

# Run the verification script
.\verify-kubernetes.ps1

# Create namespace
kubectl create namespace memoria

# Deploy all resources
kubectl apply -f .\k8s\ -n memoria

# Monitor deployment
kubectl get deployments -n memoria -w
```

### Step-by-Step Deploy
```powershell
# 1. Create namespace
kubectl apply -f .\k8s\namespace.yaml

# 2. Deploy databases
kubectl apply -f .\k8s\database\ -n memoria

# 3. Deploy microservices
kubectl apply -f .\k8s\deployments\ -n memoria

# 4. Deploy services
kubectl apply -f .\k8s\services\ -n memoria
```

## Verification Commands

```powershell
# Check namespace
kubectl get namespaces

# Check all resources in namespace
kubectl get all -n memoria

# Check specific resources
kubectl get deployments -n memoria
kubectl get services -n memoria
kubectl get pods -n memoria
kubectl get secrets -n memoria

# Check pod logs
kubectl logs -n memoria -l app=memoria-gateway

# Port forward to gateway
kubectl port-forward -n memoria svc/memoria-gateway 8888:8888

# Access dashboard
kubectl proxy
# Then open: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

## Environment Variables in Deployments

### Gateway
- `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`: http://eureka-server:8761/eureka/

### Microservices
Each service is configured to:
1. Register with Eureka server for service discovery
2. Connect to MySQL databases using credentials from Secrets
3. Use JWT for authentication (secret from Secrets)

## Health Checks

Each deployment includes:
- **Readiness Probe**: Checks `/actuator/health` endpoint
- **Initial Delay**: 120 seconds
- **Period**: 20 seconds
- **Timeout**: 10 seconds
- **Failure Threshold**: 3

## Resource Limits

All containers are configured with:
- **Memory Request**: 128Mi
- **Memory Limit**: 256Mi
- **CPU Request**: 100m
- **CPU Limit**: 300m

These values can be adjusted based on cluster capacity.

## Network Configuration

### Service Discovery (DNS)
Inside the cluster, services are accessible via:
- `service-name` (within same namespace)
- `service-name.memoria` (fully qualified)
- `service-name.memoria.svc.cluster.local` (FQDN)

### External Access
Gateway is exposed via NodePort (30888):
- On Minikube: `minikube service memoria-gateway -n memoria`
- On cluster node: `http://node-ip:30888`
- Via port-forward: `kubectl port-forward`

## Troubleshooting

### Pods not starting
```powershell
# Check pod status
kubectl describe pod -n memoria pod-name

# Check logs
kubectl logs -n memoria pod-name
```

### Services not communicating
```powershell
# Test connectivity between pods
kubectl exec -it -n memoria pod-name -- /bin/bash
# Then from pod: curl http://service-name:port/health
```

### Image pull issues
```powershell
# Ensure images are available
kubectl describe pod -n memoria pod-name | grep -A 5 "Events"
```

## Configuration Files Location
- `/MemoriA-dev/k8s/namespace.yaml` - Namespace definition
- `/MemoriA-dev/k8s/database/` - Database deployments and secrets
- `/MemoriA-dev/k8s/deployments/` - Microservice deployments
- `/MemoriA-dev/k8s/services/` - Service definitions
- `/MemoriA-dev/k8s/monitoring/` - Monitoring configurations (if present)

## Security Notes

⚠️ **Important**: The current configuration uses base64-encoded secrets directly in YAML files.

**For Production**:
1. Use external secret management (Vault, AWS Secrets Manager, etc.)
2. Don't commit secrets to version control
3. Use RBAC for access control
4. Enable network policies
5. Use TLS for all communications
6. Implement pod security policies

## Performance Tuning

To optimize for your cluster:
1. Adjust resource requests/limits based on actual usage
2. Configure horizontal pod autoscaling (HPA)
3. Implement node affinity for critical services
4. Use persistent volumes for databases
5. Configure ingress for better traffic management

## Next Steps

1. Run `.\verify-kubernetes.ps1` to validate setup
2. Deploy resources to cluster
3. Monitor pod startup with `kubectl get pods -w -n memoria`
4. Test service connectivity
5. Configure monitoring and logging
6. Set up CI/CD pipeline for deployments
