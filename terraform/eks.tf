resource "aws_eks_cluster" "main" {
  name     = "k8s-project-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.35"

  vpc_config {
    subnet_ids = [
      aws_subnet.public_a.id,
      aws_subnet.public_b.id
    ]
    # Restringe acesso publico ao API Server (Ideal deixar apenas seu IP ou rede corporativa, 
    # mas para portfolio 0.0.0.0/0 facilita os testes via kubectl local)
    endpoint_public_access = true
  }

  access_config {
    authentication_mode                         = "API_AND_CONFIG_MAP"
    bootstrap_cluster_creator_admin_permissions = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "k8s-project-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn

  # Instancia provisionada nas subnets publicas
  subnet_ids = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]

  scaling_config {
    desired_size = 1
    max_size     = 2
    min_size     = 1
  }

  ami_type       = "AL2023_x86_64_STANDARD"
  instance_types = ["t3.small"] # t3.small reduz custos, sendo o minimo recomendavel para EKS
  capacity_type  = "ON_DEMAND"  # Pode ser alterado para SPOT p/ reduzir custos

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_ecr_readonly,
  ]
}

# Permissao de Administrador no Cluster para o usuario especifico via variavel
resource "aws_eks_access_entry" "admin_user" {
  cluster_name  = aws_eks_cluster.main.name
  principal_arn = var.admin_user_arn
  type          = "STANDARD"
}

resource "aws_eks_access_policy_association" "admin_user_policy" {
  cluster_name  = aws_eks_cluster.main.name
  policy_arn    = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
  principal_arn = var.admin_user_arn

  access_scope {
    type = "cluster"
  }
}
