pipeline {
    // No global agent here if stages have their own agents
    stages {
        stage("Build") {
            agent { label 'DevServer' }
            steps {
                echo "This is Build stage running on DevServer"
            }
        }

        stage("Test") {
            agent { label 'DevServer' }
            steps {
                echo "This is Test stage running on DevServer"
            }
        }

        stage("Deploy") {
            agent { label 'ProdServer' }
            steps {
                echo "This is Deploy stage running on prodserver"
            }
        }
    }
}
