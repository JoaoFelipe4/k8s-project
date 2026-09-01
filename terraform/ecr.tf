resource "aws_ecr_repository" "backend" {
  name                 = "k8s-project-backend"
  image_tag_mutability = "MUTABLE"
  force_destroy        = true

  image_scanning_configuration {
    scan_on_push = true
  }
}
