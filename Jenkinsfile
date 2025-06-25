pipeline{
    
    agent any

    stages{
        agent{
            DevServer
        }
        stage("build"){
            steps{
                echo "This is build"
            }
            
        }

        stage("Test"){
            steps{
                echo "This is Test man"
            }
            
        }

        stage("Deploy"){
            steps{
                echo "This is Deploy man"
            }
            
        }
    }

}