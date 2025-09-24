pipeline {
    agent any

    tools {
        nodejs "node18"   // must match Node.js version in Jenkins Global Tool Config
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Khurram262/Peerpay.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                // If you don’t want tests, you can comment this out
                bat 'npm test'
            }
        }
    }
}
