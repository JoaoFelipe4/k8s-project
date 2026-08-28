# Kubernetes Infrastructure Project

This repository contains the infrastructure and application definitions for a personal cloud-native platform. It is developed for study purposes and to host personal projects.

## Architecture Overview

The project is structured into three main layers:
- Application source code and containerization specifications.
- Kubernetes deployment manifests and GitOps configurations.
- Infrastructure as Code (IaC) for cluster provisioning.

## Directory Structure

- `app/`: Source code for the applications running on the cluster.
- `docs/`: Technical documentation and architecture diagrams.
- `k8s/`: Kubernetes manifests (deployments, services, ingress) and ArgoCD configuration.
- `terraform/`: Infrastructure provisioning code.
- `.github/workflows/`: CI/CD pipelines for automated testing and deployment.

## 🚀 Quick Start & Deployment Guide

While this architecture is heavily automated via CI/CD and GitOps pipelines, spinning up the environment from scratch in a new AWS account requires a few initial bootstrap steps due to strict security configurations and dynamic identity requirements:

### Step 1: Bootstrap AWS Authentication (OIDC)
Before running pipelines, you must create a trust relationship between this GitHub repository and your AWS Account using OpenID Connect (OIDC).
* **Reference**: Read `.github/workflows/README.md` for exact instructions on creating the OIDC Provider and the IAM Role (`GitHubActions-ECR-Push-Role`) in AWS.

### Step 2: Inject GitHub Secrets
This project intentionally avoids hardcoding sensitive identifiers in the Git repository. You must add the following Secrets to your GitHub repository settings:
- `EKS_ADMIN_USER_ARN`: The ARN of your personal IAM User (e.g., `arn:aws:iam::1234567890:user/Admin`). This grants you visibility into the EKS cluster via the AWS Console.

### Step 3: Provision Infrastructure
Trigger the **Terraform CI/CD** pipeline via the GitHub Actions UI (using `workflow_dispatch` on the `apply` branch). This will:
1. Spin up the VPC, Subnets, and EKS 1.35 Cluster.
2. Automatically install the **AWS Load Balancer Controller** via Helm.
3. Configure the CloudWatch observability stack (Alarms and Log retention).

### Step 4: The GitOps Bootstrap
Once the EKS cluster is running, authenticate your local terminal to the cluster:
```bash
aws eks update-kubeconfig --name k8s-project-cluster --region us-east-2
```
To deploy the applications, this project relies on **ArgoCD** (GitOps). You must install the ArgoCD controller into the cluster and apply the root ArgoCD Application manifest, which will automatically sync the `k8s/` directory and handle dynamic variable injection (such as masking your ECR Account ID).
* **Reference**: Read `docs/ArgoCD-Guide.md` and `k8s/argocd/README.md` for architectural context on the GitOps strategy.
