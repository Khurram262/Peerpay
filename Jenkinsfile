pipeline {
    agent any

    tools {
        nodejs "node18"   // must match what you named in Global Tool Config
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
        bat 'npm test'
    }
}
