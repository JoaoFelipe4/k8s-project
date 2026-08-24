resource "aws_eks_cluster" "main" {
  name     = "k8s-project-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.30"

  vpc_config {
    subnet_ids = [
      aws_subnet.public_a.id,
      aws_subnet.public_b.id
    ]
    # Restringe acesso publico ao API Server (Ideal deixar apenas seu IP ou rede corporativa, 
    # mas para portfolio 0.0.0.0/0 facilita os testes via kubectl local)
    endpoint_public_access = true
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

  instance_types = ["t3.medium"] # t3.medium e o ideal p/ rodar Kubernetes com folga de memoria
  capacity_type  = "ON_DEMAND"   # Pode ser alterado para SPOT p/ reduzir custos

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_ecr_readonly,
  ]
}
