# Kubernetes Troubleshooting Guide

## 🔧 Verification & Debugging

### Run Full Verification Script
```powershell
cd MemoriA-dev
.\verify-kubernetes.ps1
```

This script will:
1. ✓ Check kubectl installation
2. ✓ Verify all YAML files exist
3. ✓ Validate YAML syntax
4. ✓ Check cluster status
5. ✓ Check namespace
6. ✓ List all deployments
7. ✓ List all services
8. ✓ List all pods
9. ✓ List secrets
10. ✓ Provide deployment commands

---

## 🐛 Quick Troubleshooting Table

| Problem | Symptoms | Quick Fix |
|---------|----------|-----------|
| **Cluster not running** | `kubectl cluster-info` fails | Start Docker Desktop or Minikube |
| **kubectl not installed** | Command not found | [Install kubectl](https://kubernetes.io/docs/tasks/tools/) |
| **Wrong context** | Connecting to wrong cluster | `kubectl config use-context docker-desktop` |
| **Namespace doesn't exist** | Resources fail to deploy | `kubectl create namespace memoria` |
| **Pods pending** | `kubectl get pods` shows "Pending" | Check: memory, CPU, image availability |
| **ImagePullBackOff** | Deployment stuck pulling image | Verify image exists: `docker pull image:tag` |
| **CrashLoopBackOff** | Pod keeps restarting | Check logs: `kubectl logs pod-name -n memoria` |
| **Service unreachable** | Can't connect to service | Check service: `kubectl get svc -n memoria` |
| **No IP assigned** | `kubectl get svc` shows `<pending>` | Check LoadBalancer status |

---

## 📝 Detailed Debugging Steps

### 1. Verify Cluster is Running

```powershell
# Check cluster connection
kubectl cluster-info

# Expected output:
# Kubernetes control plane is running at https://...
# CoreDNS is running at https://...
```

**If it fails:**
- Docker Desktop: Ensure Docker is running
- Minikube: `minikube start`
- Cloud: Check cloud provider console

### 2. Verify kubectl is Installed & Configured

```powershell
# Check kubectl version
kubectl version --client --short

# Expected output: Client version: v1.xx.x

# Check current context
kubectl config current-context

# Expected output: docker-desktop (or your cluster name)
```

### 3. Check Namespace Creation

```powershell
# List all namespaces
kubectl get namespaces

# Create if missing
kubectl create namespace memoria

# Verify it exists
kubectl get namespace memoria
```

### 4. Verify YAML Files

```powershell
# Run dry-run to validate syntax
kubectl apply -f .\k8s\ --dry-run=client -n memoria

# If successful, no output means syntax is valid
```

### 5. Deploy and Monitor

```powershell
# Deploy
kubectl apply -f .\k8s\ -n memoria

# Watch deployment progress
kubectl rollout status deployment/memoria-gateway -n memoria

# If stuck, describe the deployment
kubectl describe deployment memoria-gateway -n memoria
```

### 6. Check Pod Status

```powershell
# List all pods
kubectl get pods -n memoria

# Expected output (after ~2-3 minutes):
# NAME                              READY   STATUS    RESTARTS   AGE
# eureka-server-xxxxx               1/1     Running   0          2m
# memoria-gateway-xxxxx             1/1     Running   0          2m
# mysql-alerts-xxxxx                1/1     Running   0          2m
# mysql-users-xxxxx                 1/1     Running   0          2m
# planning-deployment-xxxxx         1/1     Running   0          2m
# user-service-deployment-xxxxx     1/1     Running   0          2m
# alerts-deployment-xxxxx           1/1     Running   0          2m
```

**Statuses Explained:**
- `Pending` - Waiting for resources
- `ContainerCreating` - Pulling image and starting
- `Running` - Pod is healthy
- `CrashLoopBackOff` - Pod crashed, restarting
- `ImagePullBackOff` - Can't pull Docker image
- `ErrImagePull` - Image doesn't exist

### 7. Check Pod Logs

```powershell
# View logs from a pod
kubectl logs -n memoria eureka-server

# View last 50 lines
kubectl logs -n memoria eureka-server --tail=50

# View logs from deployment
kubectl logs -n memoria deployment/memoria-gateway

# View logs from previous crashed pod
kubectl logs -n memoria pod-name --previous

# Stream logs in real-time
kubectl logs -n memoria deployment/memoria-gateway -f

# View logs from all pods with a label
kubectl logs -n memoria -l app=memoria-gateway --all-containers=true
```

### 8. Describe Resources

```powershell
# Get detailed info about a pod
kubectl describe pod -n memoria eureka-server

# Get detailed info about deployment
kubectl describe deployment -n memoria memoria-gateway

# Get detailed info about service
kubectl describe service -n memoria memoria-gateway

# Look for "Events" section - shows recent warnings/errors
```

### 9. Check Service Connectivity

```powershell
# List all services
kubectl get services -n memoria

# Expected output:
# NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)
# eureka-server      ClusterIP   10.96.xxx.xxx    <none>        8761/TCP
# memoria-gateway    NodePort    10.96.xxx.xxx    <none>        8888:30888/TCP
# alerts-service     ClusterIP   10.96.xxx.xxx    <none>        8083/TCP
# planning-service   ClusterIP   10.96.xxx.xxx    <none>        8082/TCP
# user-service       ClusterIP   10.96.xxx.xxx    <none>        8081/TCP

# Get service endpoints (which pods are behind the service)
kubectl get endpoints -n memoria

# Port forward to test connectivity
kubectl port-forward -n memoria svc/memoria-gateway 8888:8888

# In another terminal, test
curl http://localhost:8888/actuator/health
```

### 10. Test Pod-to-Pod Communication

```powershell
# Execute a command in a pod
kubectl exec -it -n memoria eureka-server -- /bin/sh

# From inside pod, test DNS
nslookup memoria-gateway
nslookup eureka-server.memoria.svc.cluster.local

# Test port connectivity
nc -zv memoria-gateway 8888
curl http://memoria-gateway:8888/actuator/health

# Exit pod
exit
```

### 11. Check Resource Usage

```powershell
# View CPU and memory usage
kubectl top pods -n memoria
kubectl top nodes

# View resource requests and limits
kubectl describe deployment -n memoria memoria-gateway | grep -A 5 "Limits"
```

### 12. Check Events

```powershell
# View all events in namespace, sorted by time
kubectl get events -n memoria --sort-by='.lastTimestamp'

# Watch events in real-time
kubectl get events -n memoria -w

# Describe specific pod to see its events
kubectl describe pod -n memoria pod-name | grep -A 20 "Events"
```

---

## 🔍 Common Issues & Solutions

### Issue: "The Kubernetes cluster is unreachable"

```powershell
# Check if cluster is running
kubectl cluster-info

# If not running:
# - Docker Desktop: Click Docker Desktop icon → check status
# - Minikube: Run 'minikube start'
# - EKS/GKE/AKS: Check cloud provider console
```

### Issue: Pods in "ImagePullBackOff"

```powershell
# Check the image in deployment
kubectl describe deployment -n memoria memoria-gateway | grep Image

# Try pulling the image manually
docker pull fatmaellouze03/memoria-gateway:latest

# Check pod events for details
kubectl describe pod -n memoria pod-name | grep -A 10 "Events"

# Possible solutions:
# 1. Image doesn't exist: Build and push to Docker Hub
# 2. Wrong image name: Fix in deployment YAML
# 3. No internet: Check network connectivity
# 4. Auth issues: Configure imagePullSecrets in deployment
```

### Issue: Pods in "CrashLoopBackOff"

```powershell
# Check pod logs
kubectl logs -n memoria pod-name --tail=50

# Check previous logs (from crash)
kubectl logs -n memoria pod-name --previous

# Common causes:
# 1. Application crash: Check logs for exceptions
# 2. Liveness probe failing: Check /actuator/health endpoint
# 3. Database not ready: Ensure databases are running
# 4. Wrong configuration: Check environment variables

# View environment variables in pod
kubectl exec -it -n memoria pod-name -- env
```

### Issue: Services can't communicate

```powershell
# Check if services exist
kubectl get services -n memoria

# Check service endpoints
kubectl get endpoints -n memoria

# Test from within a pod
kubectl exec -it -n memoria pod-name -- /bin/sh
nslookup service-name
curl http://service-name:port/health
exit

# Check network policies
kubectl get networkpolicies -n memoria

# Check firewall/security groups (cloud deployments)
```

### Issue: Database connection errors

```powershell
# Check MySQL pods
kubectl get pods -n memoria | grep mysql

# Check MySQL logs
kubectl logs -n memoria mysql-alerts-0

# Test MySQL connection
kubectl exec -it -n memoria mysql-users-0 -- \
  mysql -u appuser -papppassword -h localhost

# Check secrets
kubectl describe secret mysql-secret -n memoria

# Verify credentials match
kubectl exec -it -n memoria pod-name -- env | grep -i mysql
```

### Issue: Persistent data loss

```powershell
# Check if using persistent volumes
kubectl get pv -n memoria
kubectl get pvc -n memoria

# If no PVs, data will be lost on pod restart
# Solution: Add PersistentVolumeClaim to MySQL deployments

# Check volume status
kubectl describe pvc -n memoria
```

---

## 🔄 Recovery & Restart Procedures

### Restart a Single Pod
```powershell
# Delete pod (will be recreated by deployment)
kubectl delete pod -n memoria pod-name

# Pod will restart immediately
kubectl get pods -n memoria -w
```

### Restart a Deployment
```powershell
# Restart deployment
kubectl rollout restart deployment/memoria-gateway -n memoria

# Check status
kubectl rollout status deployment/memoria-gateway -n memoria
```

### Restart All Deployments
```powershell
# Restart all deployments in namespace
kubectl rollout restart deployment -n memoria

# Check status
kubectl get deployments -n memoria
```

### Roll Back a Deployment
```powershell
# Check rollout history
kubectl rollout history deployment/memoria-gateway -n memoria

# Roll back to previous version
kubectl rollout undo deployment/memoria-gateway -n memoria

# Roll back to specific revision
kubectl rollout undo deployment/memoria-gateway -n memoria --to-revision=2
```

---

## 📊 Diagnostic Commands Cheat Sheet

```powershell
# === CLUSTER INFO ===
kubectl cluster-info                    # Cluster overview
kubectl get nodes                       # List nodes
kubectl top nodes                       # Node resource usage
kubectl describe node node-name         # Node details

# === NAMESPACES ===
kubectl get namespaces                  # List namespaces
kubectl get all -n memoria             # List all resources in namespace

# === DEPLOYMENTS ===
kubectl get deployments -n memoria      # List deployments
kubectl describe deployment -n memoria deployment-name
kubectl rollout status deployment/name -n memoria
kubectl logs -n memoria deployment/name # Deployment logs

# === PODS ===
kubectl get pods -n memoria             # List pods
kubectl get pods -n memoria -o wide     # Pods with node info
kubectl describe pod -n memoria pod-name
kubectl logs -n memoria pod-name        # Pod logs
kubectl logs -n memoria pod-name -f     # Stream logs
kubectl exec -it -n memoria pod-name -- /bin/sh  # Shell access

# === SERVICES ===
kubectl get svc -n memoria              # List services
kubectl get endpoints -n memoria        # Service endpoints
kubectl describe svc -n memoria svc-name
kubectl port-forward -n memoria svc/name port:port

# === SECRETS ===
kubectl get secrets -n memoria
kubectl describe secret secret-name -n memoria
kubectl get secret mysql-secret -n memoria -o yaml  # View (base64)

# === EVENTS ===
kubectl get events -n memoria --sort-by='.lastTimestamp'
kubectl describe pod -n memoria pod-name | grep -A 30 Events

# === RESOURCES ===
kubectl top pods -n memoria             # Pod resource usage
kubectl get resourcequota -n memoria    # Resource quotas
kubectl describe resourcequota -n memoria quota-name
```

---

## 💡 Tips for Efficient Debugging

1. **Always include namespace**: `-n memoria` in commands
2. **Use labels**: `kubectl get pods -n memoria -l app=memoria-gateway`
3. **Watch changes**: Add `-w` to watch real-time updates
4. **Check events first**: `kubectl describe pod` shows last 5 events
5. **Stream logs**: Use `-f` to see logs as they appear
6. **Use dry-run**: Test YAML before applying: `--dry-run=client`
7. **Format output**: Use `-o wide`, `-o json`, `-o yaml`
8. **Search logs**: `kubectl logs pod-name | grep ERROR`

---

## 📞 Getting Help

If you're stuck:

1. **Run the verification script**: `.\verify-kubernetes.ps1`
2. **Check pod status**: `kubectl describe pod -n memoria pod-name`
3. **Review logs**: `kubectl logs -n memoria pod-name`
4. **Check events**: `kubectl get events -n memoria`
5. **Review KUBERNETES_GUIDE.md**: Detailed configuration info
6. **Check K8S_CHECKLIST.md**: Pre-deployment checklist

---

**Last Updated:** May 6, 2026
