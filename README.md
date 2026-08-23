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
