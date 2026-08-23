# Kubernetes Manifests

This directory contains the resource definitions required to run the applications and cluster services. It utilizes Kustomize for configuration management across different environments.

## Directory Structure

- `argocd/`: GitOps controller configurations and application definitions.
- `base/`: Core Kubernetes manifests shared across environments.
- `overlays/`: Environment-specific patches (e.g., dev, staging, prod).
