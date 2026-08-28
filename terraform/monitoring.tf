# ---------------------------------------------------------
# AWS CloudWatch Monitoring & Observability
# ---------------------------------------------------------

# 1. Tópico SNS para envio de Alertas
# Você pode ir no console da AWS depois e inscrever seu E-mail neste tópico para receber os alertas
resource "aws_sns_topic" "eks_alerts" {
  name = "k8s-project-alerts"
}

# 2. Alarme de CPU dos Nodes do EKS
# Os primeiros 10 alarmes no CloudWatch são gratuitos (Free Tier). 
# Isso demonstra governança de infraestrutura sem adicionar custos.
resource "aws_cloudwatch_metric_alarm" "node_cpu_high" {
  alarm_name          = "k8s-project-node-cpu-high"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300 # Verifica a cada 5 minutos
  statistic           = "Average"
  threshold           = 80 # Dispara se passar de 80%
  alarm_description   = "Alarme disparado se a CPU media dos Nodes do EKS ultrapassar 80%."

  # Atrela o alarme dinamicamente ao Auto Scaling Group (ASG) criado pelo Node Group
  dimensions = {
    AutoScalingGroupName = aws_eks_node_group.main.resources[0].autoscaling_groups[0].name
  }

  alarm_actions = [aws_sns_topic.eks_alerts.arn]
  ok_actions    = [aws_sns_topic.eks_alerts.arn]
}

# 3. Log Group do EKS (Controle de Custos)
# O EKS cria logs nativamente, mas por padrao ele configura a retencao como "Never Expire".
# Se deixarmos assim, em 1 ano a conta de logs na AWS ficara carissima.
# Criamos o grupo via Terraform antes forçando a retencao de 7 dias (DevOps Best Practice).
resource "aws_cloudwatch_log_group" "eks_logs" {
  name              = "/aws/eks/k8s-project-cluster/cluster"
  retention_in_days = 7
}
