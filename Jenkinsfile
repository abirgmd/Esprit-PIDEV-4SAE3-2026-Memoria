pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_HUB_USERNAME = 'abirgamoudi123'
        APP_NAME_BACKEND_ACTIVITE = 'memoria-backend-activite'
        APP_NAME_BACKEND_COMMUNAUTE = 'memoria-backend-communaute'
        PROJECT_PATH = "/vagrant"
    }

    stages {
        stage('Checkout') {
            steps {
                // Assuming code is already in /vagrant or needs to be checked out
                echo "Checking out code..."
            }
        }
        stage('build maven') {
            steps {
                sh "cd ${PROJECT_PATH}/MemorIA_Backendgestionactivitepublication && mvn clean package -DskipTests"
                sh "cd ${PROJECT_PATH}/MemorIA_Backendgestioncommunaute && mvn clean package -DskipTests"
            }
        }
        stage('tests') {
            steps {
                sh "cd ${PROJECT_PATH}/MemorIA_Backendgestionactivitepublication && mvn test"
                sh "cd ${PROJECT_PATH}/MemorIA_Backendgestioncommunaute && mvn test"
            }
        }
        stage('build img docker') {
            steps {
                sh "cd ${PROJECT_PATH}/MemorIA_Backendgestionactivitepublication && docker build -t ${DOCKER_HUB_USERNAME}/${APP_NAME_BACKEND_ACTIVITE}:latest ."
                sh "cd ${PROJECT_PATH}/MemorIA_Backendgestioncommunaute && docker build -t ${DOCKER_HUB_USERNAME}/${APP_NAME_BACKEND_COMMUNAUTE}:latest ."
            }
        }
        stage('push docker') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS_ID}", passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USERNAME')]) {
                        sh "echo \$DOCKER_HUB_PASSWORD | docker login -u \$DOCKER_HUB_USERNAME --password-stdin"
                        sh "docker push ${DOCKER_HUB_USERNAME}/${APP_NAME_BACKEND_ACTIVITE}:latest"
                        sh "docker push ${DOCKER_HUB_USERNAME}/${APP_NAME_BACKEND_COMMUNAUTE}:latest"
                    }
                }
            }
        }
        stage('keverntes') {
            steps {
                sh "sudo kubectl apply -f ${PROJECT_PATH}/k8s/mysql-deployment.yaml --kubeconfig=/home/vagrant/.kube/config || true"
                sh "sudo kubectl apply -f ${PROJECT_PATH}/k8s/backend-activite.yaml --kubeconfig=/home/vagrant/.kube/config || true"
                sh "sudo kubectl apply -f ${PROJECT_PATH}/k8s/backend-communaute.yaml --kubeconfig=/home/vagrant/.kube/config || true"
            }
        }
    }
}
