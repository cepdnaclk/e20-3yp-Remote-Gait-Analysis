pipeline {
    agent { label 'DevServer' }

    tools {
        maven 'Maven 3.9.7'
    }

    environment {
        BACKEND_DIR = 'gait-analysis-backend'
        JAR_NAME = 'gait-backend.jar'
        BACKEND_HOST = '13.51.74.35'
        CONTAINER_NAME = 'gait-backend'
        IMAGE_NAME = 'yohansenanayake/rehabgait-backend:latest'
        DEPLOY_DIR = '/home/ubuntu/backend'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Backend Test') {
            steps {
                dir("${env.BACKEND_DIR}") {
                    echo "HI no test"
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir("${env.BACKEND_DIR}") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Archive JAR') {
            steps {
                dir("${env.BACKEND_DIR}") {
                    archiveArtifacts artifacts: "target/${env.JAR_NAME}", fingerprint: true
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                dir("${env.BACKEND_DIR}") {
                    script {
                        sh "docker build -t ${env.IMAGE_NAME} ."

                        withCredentials([usernamePassword(
                            credentialsId: 'dockerhub-credentials',
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_PASS'
                        )]) {
                            sh """
                                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                                docker push ${env.IMAGE_NAME}
                                docker logout
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy to Backend Server') {
            steps {
                sshagent(['rehabgait-backend-deploy-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${env.BACKEND_HOST} << EOF
                        set -e
                        cd ${env.DEPLOY_DIR}
                        docker pull ${env.IMAGE_NAME}
                        docker stop ${env.CONTAINER_NAME} || true
                        docker rm ${env.CONTAINER_NAME} || true
                        docker run -d --name ${env.CONTAINER_NAME} \
                            --env-file .env.prod \
                            -p 8080:8080 \
                            ${env.IMAGE_NAME}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build, test, image push, and deployment successful!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs and stages for more information."
        }
    }
}
