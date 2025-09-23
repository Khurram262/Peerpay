pipeline {
  agent any

  tools {
    nodejs 'node18'  // Configure NodeJS tool in Jenkins with this name
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'   // clean install using package-lock.json
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'   // Next.js + TS projects usually have lint script
      }
    }

    stage('Type Check') {
      steps {
        sh 'npx tsc --noEmit'   // ensures TypeScript compiles
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'   // Next.js build step
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'   // if you have a test script (Jest/Playwright etc.)
      }
    }

    stage('Archive Build') {
      steps {
        archiveArtifacts artifacts: '.next/**', fingerprint: true
      }
    }
  }

  post {
    success {
      echo '✅ PeerPay built successfully with Next.js + TypeScript + Tailwind'
    }
    failure {
      echo '❌ Build failed, check logs'
    }
    always {
      cleanWs()
    }
  }
}
