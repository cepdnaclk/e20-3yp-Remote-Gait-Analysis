pipeline {
    agent { label 'DevServer' }

    tools {
        maven 'Maven 3.9.7' // Replace with your actual Maven tool name
    }

    environment {
        BACKEND_DIR = 'gait-analysis-backend'
        JAR_NAME = 'gait-backend.jar'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
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
    }

    post {
        success {
            echo "✅ Spring Boot backend built and archived as ${env.JAR_NAME}!"
        }
        failure {
            echo '❌ Backend build failed.'
        }
    }
}
