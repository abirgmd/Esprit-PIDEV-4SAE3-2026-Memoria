pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = "memoria-backend-jasser"
        GATEWAY_IMAGE  = "api-gateway-jasser"
        DOCKERHUB_CRED = credentials('dockerhub-credentials')
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Unit Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('MemorIA_Backend') {
                            sh './mvnw test'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true,
                                  testResults: 'MemorIA_Backend/target/surefire-reports/**/*.xml'
                        }
                    }
                }
                stage('Gateway Tests') {
                    steps {
                        dir('api-gateway') {
                            sh './mvnw test'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true,
                                  testResults: 'api-gateway/target/surefire-reports/**/*.xml'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    dir('MemorIA_Backend') {
                        sh """
                            ./mvnw sonar:sonar \
                              -Dsonar.projectKey=memoria-backend-jasser \
                              -Dsonar.projectName='MemorIA Backend'
                        """
                    }
                    dir('api-gateway') {
                        sh """
                            ./mvnw sonar:sonar \
                              -Dsonar.projectKey=api-gateway-jasser \
                              -Dsonar.projectName='MemorIA API Gateway'
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Package') {
            parallel {
                stage('Package Backend') {
                    steps {
                        dir('MemorIA_Backend') {
                            sh './mvnw clean package -DskipTests'
                        }
                    }
                }
                stage('Package Gateway') {
                    steps {
                        dir('api-gateway') {
                            sh './mvnw clean package -DskipTests'
                        }
                    }
                }
            }
        }

        stage('Docker Build') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('MemorIA_Backend') {
                            sh "docker build -t ${BACKEND_IMAGE}:latest -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ."
                        }
                    }
                }
                stage('Build Gateway Image') {
                    steps {
                        dir('api-gateway') {
                            sh "docker build -t ${GATEWAY_IMAGE}:latest -t ${GATEWAY_IMAGE}:${BUILD_NUMBER} ."
                        }
                    }
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                sh "echo ${DOCKERHUB_CRED_PSW} | docker login -u ${DOCKERHUB_CRED_USR} --password-stdin"
                sh "docker tag ${BACKEND_IMAGE}:latest  ${DOCKERHUB_CRED_USR}/${BACKEND_IMAGE}:latest"
                sh "docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${DOCKERHUB_CRED_USR}/${BACKEND_IMAGE}:${BUILD_NUMBER}"
                sh "docker push ${DOCKERHUB_CRED_USR}/${BACKEND_IMAGE}:latest"
                sh "docker push ${DOCKERHUB_CRED_USR}/${BACKEND_IMAGE}:${BUILD_NUMBER}"
                sh "docker tag ${GATEWAY_IMAGE}:latest  ${DOCKERHUB_CRED_USR}/${GATEWAY_IMAGE}:latest"
                sh "docker tag ${GATEWAY_IMAGE}:${BUILD_NUMBER} ${DOCKERHUB_CRED_USR}/${GATEWAY_IMAGE}:${BUILD_NUMBER}"
                sh "docker push ${DOCKERHUB_CRED_USR}/${GATEWAY_IMAGE}:latest"
                sh "docker push ${DOCKERHUB_CRED_USR}/${GATEWAY_IMAGE}:${BUILD_NUMBER}"
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying MemorIA with Docker Compose...'
                sh 'docker-compose down --remove-orphans'
                sh 'docker-compose up -d'
                echo 'Services are up. Gateway → http://localhost:8080'
            }
        }
    }

    post {
        success {
            echo "Build #${BUILD_NUMBER} succeeded. MemorIA is deployed."
        }
        failure {
            echo "Build #${BUILD_NUMBER} failed. Check the stage logs above."
        }
        always {
            sh 'docker logout || true'
        }
    }
}
