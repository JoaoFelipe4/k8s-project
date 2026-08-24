# CI/CD Pipelines

This directory contains GitHub Actions workflows.

## Responsibilities

- Automated testing and linting of application code.
- Building and pushing container images to a registry.
- Static analysis of Kubernetes manifests and Terraform configurations.

## AWS Authentication (OIDC Setup)

To allow GitHub Actions to push Docker images to AWS ECR securely, we utilize **OpenID Connect (OIDC)**. This approach eliminates the need to store long-lived AWS Access Keys in GitHub Secrets.

Follow the step-by-step guide below to configure this trust relationship in your AWS account.

### Step 1: Create the GitHub OIDC Provider in AWS

1. Log into the AWS Management Console and open the **IAM** service.
2. In the left navigation pane, select **Identity providers** -> **Add provider**.
3. Select **OpenID Connect**.
4. Configure the provider:
   - **Provider URL**: `https://token.actions.githubusercontent.com` (Click "Get thumbprint").
   - **Audience**: `sts.amazonaws.com`
5. Click **Add provider**.

### Step 2: Create the IAM Role

1. In the IAM console, navigate to **Roles** -> **Create role**.
2. Select **Web identity** as the trusted entity type.
3. Choose the identity provider you just created (`token.actions.githubusercontent.com`) and the audience (`sts.amazonaws.com`).
4. Click Next.

### Step 3: Attach ECR Permissions

1. On the permissions page, create or attach a policy that grants access to ECR. For a minimum viable setup, you can attach `AmazonEC2ContainerRegistryPowerUser`.
   *(For production, create a custom inline policy that restricts push access strictly to your specific ECR repository ARN).*
2. Name your role (e.g., `GitHubActions-ECR-Push-Role`) and create it.

### Step 4: Restrict Access to Your Repository (Crucial)

To ensure no other GitHub repository can assume your role, you must edit the Trust Policy.
1. Find your newly created Role in IAM and go to the **Trust relationships** tab.
2. Edit the trust policy. Ensure the `Condition` block strictly matches your repository. It should look like this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
                    "token.actions.githubusercontent.com:sub": [
                        "repo:YourGitHubUsername@YOUR_ID/YourRepositoryName@REPO_ID:ref:refs/heads/main",
                        "repo:YourGitHubUsername@YOUR_ID/YourRepositoryName@REPO_ID:environment:Production"
                    ]
                }
            }
        }
    ]
}
```

> **Security Note:** When GitHub Actions runs a job tied to a deployment `environment` (e.g., `Production`), the OIDC `sub` claim drops the branch reference and adopts the environment name. The Trust Policy above uses an array in `StringEquals` to securely permit both standard branch pushes (for `plan`) and environment deployments (for `apply`).

### Step 5: Configure the GitHub Workflow

Once the AWS setup is complete, you must configure your workflow YAML file to request the OIDC token and assume the role. 

Add the `permissions` block and the AWS configuration step to your job:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    # Required to fetch the OIDC token
    permissions:
      id-token: write
      contents: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActions-ECR-Push-Role
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
        
      # Following this, you can run `docker build` and `docker push`
```

### Note on Infrastructure as Code (IaC)

If you prefer to automate this setup, this entire configuration can be easily translated to **Terraform**. You would use the `aws_iam_openid_connect_provider` resource to register GitHub as an IdP, and an `aws_iam_role` with an `assume_role_policy` jsonencoded to match the trust relationship described in Step 4.
