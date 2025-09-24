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

       
   stage('Cypress Tests in Parallel') {
    parallel {
        stage('Login Tests') {
            steps {
                sh 'npx cypress run --spec "cypress/e2e/login.cy.js"'
            }
        }
        stage('Signup Tests') {
            steps {
                sh 'npx cypress run --spec "cypress/e2e/signup.cy.js"'
            }
        }
        stage('Dashboard Tests') {
            steps {
                sh 'npx cypress run --spec "cypress/e2e/dashboard.cy.js"'
            }
        }
    }
}

