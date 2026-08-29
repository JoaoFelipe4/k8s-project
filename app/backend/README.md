# Backend Application & GitOps Developer Workflow

This directory contains the source code for the backend application. As a developer, your workflow is strictly separated from the infrastructure operations.

## The GitOps Application Lifecycle

When you need to develop a new feature, fix a bug, or release a new version of this application, you will follow a seamless CI/CD GitOps workflow:

### 1. Development (Local)
You write your code locally inside this directory (`app/backend/`). You can test it using standard Node.js commands (`npm start`, `npm test`) or by running it in a local Docker container.

### 2. Versioning & Commit
Once your code is ready, you simply commit and push it to the `main` branch (or create a Pull Request).
- **No manual tagging needed**: You do not need to manually change version numbers in the Kubernetes manifests.

### 3. Continuous Integration (The Push)
The moment your code hits the `main` branch, the GitHub Actions `Backend CI` pipeline wakes up:
- It runs your unit tests.
- It builds a new Docker Image.
- It tags the image with the unique **Git Commit SHA** (e.g., `v-a1b2c3d`) and pushes it to Amazon ECR.
- *For compatibility with our current ArgoCD setup, it also tags the image as `latest`.*

### 4. Continuous Delivery (The Pull)
ArgoCD, living inside the Kubernetes cluster, detects that the `latest` image tag in ECR has been overwritten, or detects changes in the Git repository.
- ArgoCD gracefully terminates the old Pods and spins up the new Pods running your new code, ensuring **Zero Downtime**.

## Modifying Infrastructure for the App
If your application suddenly needs a new Environment Variable, a new Port, or more CPU/Memory, you do **not** change it here. You must update the Kubernetes manifests located in `../../k8s/base/backend/deployment.yaml`. Once you commit that change, ArgoCD will immediately apply the new infrastructure settings to your application.

## 🛠️ Troubleshooting: Node Image Caching (The "Force Pull" Flag)
If you are developing locally or testing in an environment where you constantly overwrite the `:latest` image tag in ECR, you might notice that Kubernetes does not update your application even when new Pods are spun up.
- **The Cause:** Kubernetes Worker Nodes (EC2) cache Docker images locally. If a Node already has an image named `:latest`, it will use the cached version to save bandwidth, completely ignoring the new image in ECR.
- **The Fix:** We have explicitly added the flag `imagePullPolicy: Always` to the `deployment.yaml`. This forces the Kubernetes Kubelet to bypass the local cache and always download the fresh image from AWS ECR every time a Pod is created.
*(Note: In a strict production environment, you should avoid the `:latest` tag entirely and use immutable Git Commit SHAs, which naturally prevents this caching issue).*
