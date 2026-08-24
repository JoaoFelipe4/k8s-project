terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Configuração do Backend remoto (S3) para salvar o tfstate
  # Substitua o nome do bucket por algo exclusivo para a sua conta
  backend "s3" {
    bucket         = "tf-state-k8s-project-2026-m5zl9y4dq0"
    key            = "eks-cluster/terraform.tfstate"
    region         = "us-east-2"
    encrypt        = true
    # dynamodb_table = "terraform-lock" # Remova o comentario apos criar a tabela
  }
}

provider "aws" {
  region = "us-east-2"
  default_tags {
    tags = {
      Project     = "k8s-project"
      Environment = "production"
      ManagedBy   = "Terraform"
    }
  }
}
