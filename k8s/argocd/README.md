# ArgoCD Delivery Architecture

This document describes the Continuous Delivery (CD) architecture implemented in this cluster using ArgoCD, and how it interfaces with the project's Continuous Integration (CI) pipelines.

## Architectural Role

ArgoCD operates as the sole delivery orchestrator for the Kubernetes environment. Following GitOps principles, ArgoCD runs continuously inside the EKS cluster, functioning as a pull-based controller. Its primary responsibility is to ensure that the live state of the cluster mirrors the desired state defined in the `k8s/` directory of this repository.

## Dual-Track CI Integration

This project is architected to support multiple Continuous Integration engines simultaneously, specifically demonstrating compatibility with both **GitHub Actions** and **AWS CodeBuild**. 

Regardless of the CI engine used, the handoff to ArgoCD remains consistent through strict Separation of Concerns:

1. **Continuous Integration (Push)**
   - The CI engine (GitHub Actions or AWS CodeBuild) monitors the application source code.
   - Upon detecting changes, the CI engine executes unit tests, builds the container image, and pushes the artifact to Amazon ECR.
   - **State Update:** The CI engine commits the newly generated image tag directly to the Kubernetes manifest files (e.g., updating `kustomization.yaml`) in this Git repository.
   - *Note: The CI pipelines hold zero permissions to interact with the EKS API.*

2. **Continuous Delivery (Pull)**
   - ArgoCD detects the new Git commit containing the updated image tag.
   - ArgoCD automatically pulls the new manifest definitions and initiates a rolling update in the EKS cluster to deploy the new application version.

## Security Posture

By decoupling the CI build phase from the CD deployment phase, this architecture drastically reduces the security blast radius. Neither GitHub Actions nor AWS CodeBuild require `kubectl` access, IAM access to the cluster, or broad EKS privileges. The deployment lifecycle is securely localized inside the cluster via ArgoCD.
