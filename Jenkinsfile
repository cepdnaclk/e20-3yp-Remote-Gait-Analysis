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
        FRONTEND_DIR = 'gait-analysis-frontend'
        S3_BUCKET = 'www.rehabgait.com'
        AWS_REGION = 'eu-north-1'

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
                        withCredentials([
                            file(credentialsId: 'env-test-file', variable: 'ENV_TEST_FILE')
                        ]) {
                            sh '''#!/bin/bash
                            echo "📦 Loading test environment variables"
                            set -a
                            . "$ENV_TEST_FILE"
                            set +a
                            mvn test
                            '''
                        }
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

            stage('Build Frontend') {
                steps {
                    dir("${env.FRONTEND_DIR}") {
                        withCredentials([file(credentialsId: 'env-prod-frontend', variable: 'FRONTEND_ENV')]) {
                            sh '''
                                echo "🌐 Setting up frontend environment"
                                cp $FRONTEND_ENV .env.production
                                export NVM_DIR="$HOME/.nvm"
                                [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

                                nvm use 20
                                npm ci
                                npm run build
                            '''
                        }
                    }
                }
            }

            stage('Upload to S3') {
                steps {
                    dir("${env.FRONTEND_DIR}") {
                        sh '''
                            echo "📤 Syncing frontend build to S3 bucket: ${S3_BUCKET}"
                            aws s3 sync dist/ s3://${S3_BUCKET}/ --delete --region ${AWS_REGION}
                        '''
                    }
                }
            }

            stage('Invalidate CloudFront Cache') {
                steps {
                    sh '''
                        echo "🚀 Invalidating CloudFront cache"
                        aws cloudfront create-invalidation --distribution-id E2R68S9IUACL7H --paths "/*"
                        aws cloudfront create-invalidation --distribution-id ERP7VK01EA1CA --paths "/*"
                    '''
                }
            }

    }

    post {
        always {
            cleanWs()
        }

        success {
            echo "✅ Build, test, image push, and deployment successful!"
            emailext (
                            to: 'yohansenanayake4321@gmail.com',
                            subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                            body: """<p>Good news! The job <b>${env.JOB_NAME}</b> build <b>${env.BUILD_NUMBER}</b> succeeded.</p>""",
                            replyTo: 'noreply@rehabgait.com',
                            from: 'alert@rehabgait.com'
                      )
        }


        failure {
            echo "❌ Pipeline failed. Check logs and stages for more information."
            emailext (
                            to: 'yohansenanayake4321@gmail.com',
                            subject: "FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                            body: """<p>Unfortunately, the job <b>${env.JOB_NAME}</b> build <b>${env.BUILD_NUMBER}</b> failed.</p>""",
                            replyTo: 'noreply@rehabgait.com',
                            from: 'alert@rehabgait.com'
                      )
        }

    }
}
