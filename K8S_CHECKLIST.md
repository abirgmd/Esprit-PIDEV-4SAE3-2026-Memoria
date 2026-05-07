# Kubernetes Configuration Checklist

## ✅ Configuration Status

### Namespace
- [x] Namespace defined: `memoria`
- [x] File: [k8s/namespace.yaml](k8s/namespace.yaml)

### Database Layer
- [x] MySQL Alerts deployment configured
- [x] MySQL Users deployment configured
- [x] Secrets for credentials: `mysql-secret`
- [x] Files:
  - [k8s/database/mysql-alerts-deployment.yaml](k8s/database/mysql-alerts-deployment.yaml)
  - [k8s/database/mysql-users-deployment.yaml](k8s/database/mysql-users-deployment.yaml)
  - [k8s/database/mysql-secret.yaml](k8s/database/mysql-secret.yaml)

### Microservices Deployments
- [x] Eureka Server (Service Discovery)
  - Image: eureka:latest
  - Port: 8761
  - File: [k8s/deployments/eureka-deployment.yaml](k8s/deployments/eureka-deployment.yaml)

- [x] Gateway
  - Image: fatmaellouze03/memoria-gateway:latest
  - Port: 8888 (NodePort: 30888)
  - File: [k8s/deployments/gateway-deployment.yaml](k8s/deployments/gateway-deployment.yaml)

- [x] User Service
  - Port: 8081
  - File: [k8s/deployments/user-service-deployment.yaml](k8s/deployments/user-service-deployment.yaml)

- [x] Planning Service
  - Port: 8082
  - File: [k8s/deployments/planning-deployment.yaml](k8s/deployments/planning-deployment.yaml)

- [x] Alerts Service
  - Port: 8083
  - File: [k8s/deployments/alerts-deployment.yaml](k8s/deployments/alerts-deployment.yaml)

### Services
- [x] Eureka Service: [k8s/services/eureka-service.yaml](k8s/services/eureka-service.yaml)
- [x] Gateway Service (NodePort): [k8s/services/gateway-service.yaml](k8s/services/gateway-service.yaml)
- [x] User Service: [k8s/services/user-service.yaml](k8s/services/user-service.yaml)
- [x] Planning Service: [k8s/services/planning-service.yaml](k8s/services/planning-service.yaml)
- [x] Alerts Service: [k8s/services/alerts-service.yaml](k8s/services/alerts-service.yaml)

## 📋 Pre-Deployment Checklist

Before deploying to Kubernetes:

### Prerequisites
- [ ] kubectl installed: `kubectl version --client`
- [ ] Kubernetes cluster running
- [ ] Cluster context configured: `kubectl config current-context`
- [ ] Access to cluster: `kubectl cluster-info`

### Docker Images
- [ ] `fatmaellouze03/memoria-gateway:latest` available on Docker Hub
- [ ] `memoria-user-service:latest` available or in registry
- [ ] `memoria-planning-service:latest` available or in registry
- [ ] `memoria-alerts-service:latest` available or in registry
- [ ] `eureka:latest` available or in registry
- [ ] `mysql:8.0` available or in registry

### Configuration Files
- [ ] All YAML files syntactically valid
- [ ] Docker images exist and are accessible
- [ ] Resource limits appropriate for cluster
- [ ] Secrets configured correctly
- [ ] Database initialization scripts ready

### Run Verification
```powershell
cd MemoriA-dev
.\verify-kubernetes.ps1
```

## 🚀 Deployment Steps

### Step 1: Validate Configuration
```powershell
.\verify-kubernetes.ps1
```

### Step 2: Create Namespace
```powershell
kubectl create namespace memoria
# or
kubectl apply -f .\k8s\namespace.yaml
```

### Step 3: Deploy Secrets
```powershell
kubectl apply -f .\k8s\database\mysql-secret.yaml -n memoria
```

### Step 4: Deploy Databases
```powershell
kubectl apply -f .\k8s\database\ -n memoria
```

Wait for MySQL pods to be ready:
```powershell
kubectl get pods -n memoria -w
```

### Step 5: Deploy Microservices
```powershell
kubectl apply -f .\k8s\deployments\ -n memoria
```

### Step 6: Deploy Services
```powershell
kubectl apply -f .\k8s\services\ -n memoria
```

### Step 7: Verify Deployment
```powershell
# Check all deployments
kubectl get deployments -n memoria

# Check all pods
kubectl get pods -n memoria

# Check all services
kubectl get services -n memoria

# Watch pod status
kubectl get pods -n memoria -w
```

## 🔍 Post-Deployment Verification

### Check Deployment Status
```powershell
# View deployment details
kubectl describe deployment memoria-gateway -n memoria

# Check pod status
kubectl describe pod -n memoria -l app=memoria-gateway

# View pod logs
kubectl logs -n memoria -l app=memoria-gateway
```

### Test Service Connectivity
```powershell
# Port forward to gateway
kubectl port-forward -n memoria svc/memoria-gateway 8888:8888

# In another terminal, test the gateway
curl http://localhost:8888/actuator/health
```

### Check Database Connectivity
```powershell
# Access MySQL pod
kubectl exec -it -n memoria mysql-alerts-0 -- mysql -u appuser -p

# List databases
SHOW DATABASES;
```

## ⚠️ Common Issues & Solutions

### Issue: Pods stuck in "Pending"
**Solution:**
```powershell
# Check pod events
kubectl describe pod -n memoria pod-name

# Check node resources
kubectl top nodes
kubectl describe nodes

# Check storage availability
kubectl get pvc -n memoria
```

### Issue: ImagePullBackOff
**Solution:**
```powershell
# Check image availability
docker pull fatmaellouze03/memoria-gateway:latest

# Check pod events
kubectl describe pod -n memoria pod-name | grep -A 5 "Events"
```

### Issue: Services not communicating
**Solution:**
```powershell
# Test DNS resolution
kubectl exec -it -n memoria pod-name -- nslookup eureka-server

# Test port connectivity
kubectl exec -it -n memoria pod-name -- nc -zv eureka-server 8761
```

### Issue: Database connection errors
**Solution:**
```powershell
# Check secrets
kubectl get secrets -n memoria
kubectl describe secret mysql-secret -n memoria

# Verify credentials
kubectl exec -it -n memoria mysql-users-0 -- mysql -u root -p

# Check environment variables in deployments
kubectl exec -it -n memoria pod-name -- env | grep -i db
```

## 📊 Monitoring Commands

```powershell
# Real-time resource usage
kubectl top pods -n memoria
kubectl top nodes

# Pod events
kubectl get events -n memoria --sort-by='.lastTimestamp'

# Service endpoints
kubectl get endpoints -n memoria

# Pod network connectivity
kubectl exec -it -n memoria pod-name -- traceroute service-name

# Logs for troubleshooting
kubectl logs -n memoria deployment/memoria-gateway --tail=100
kubectl logs -n memoria deployment/memoria-gateway --previous  # Crashed pod logs
```

## 🔐 Security Considerations

### Before Production
- [ ] Move secrets to external management (Vault, AWS Secrets Manager)
- [ ] Enable RBAC (Role-Based Access Control)
- [ ] Implement network policies
- [ ] Configure pod security policies
- [ ] Enable audit logging
- [ ] Use TLS for all communications
- [ ] Scan container images for vulnerabilities
- [ ] Implement resource quotas
- [ ] Set up pod resource limits

### Secrets Management
```powershell
# DO NOT store secrets in YAML files for production
# Instead, use:

# 1. External Secrets Operator
# 2. Vault integration
# 3. Cloud provider secrets (AWS Secrets Manager, Azure Key Vault, etc.)
# 4. Sealed Secrets (for GitOps)

# Current dev/test setup:
kubectl create secret generic mysql-secret \
  --from-literal=root-password=rootpass \
  --from-literal=username=appuser \
  --from-literal=password=apppassword \
  -n memoria
```

## 🛑 Cleanup

To remove all resources:

```powershell
# Delete everything in the namespace
kubectl delete namespace memoria

# or delete resources individually
kubectl delete -f .\k8s\ -n memoria
```

## 📚 Useful References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Spring Cloud on Kubernetes](https://spring.io/projects/spring-cloud-kubernetes)
- [Microservices Architecture Patterns](https://microservices.io/patterns/)

## 📞 Support

For issues:
1. Run `.\verify-kubernetes.ps1` to identify problems
2. Check `KUBERNETES_GUIDE.md` for detailed instructions
3. Review pod logs: `kubectl logs -n memoria pod-name`
4. Check events: `kubectl describe pod -n memoria pod-name`

---

**Last Updated:** May 6, 2026
**Status:** ✅ Ready for deployment
