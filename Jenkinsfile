def COLOR_MAP = [
    'SUCCESS': 'good',
    'FAILURE': 'danger',
]

pipeline {
  agent none
  environment {
    //put your environment variables
    doError = '0'
    DOCKER_REPO = "421320058418.dkr.ecr.eu-central-1.amazonaws.com/jenkins-demo"
    AWS_REGION = "eu-central-1"
    HELM_RELEASE_NAME = "node-demo"
  }
    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
  }
//check every minute for changes
  triggers {
    pollSCM('*/1 * * * *')
  }
  stages {
    //Build container image
    stage('Build') {
      agent {
        kubernetes {
          label 'jenkinsrun'
          defaultContainer 'dind'
          yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: dind
    image: docker:18.05-dind
    securityContext:
      privileged: true
    volumeMounts:
      - name: dind-storage
        mountPath: /var/lib/docker
  volumes:
    - name: dind-storage
      emptyDir: {}
"""
        }
      }
      steps {
        withAWS(credentials: 'jenkins-demo') {
        container('dind') {
          script {
            sh '''
            docker build --network=host \
            -t ${DOCKER_REPO}:${BUILD_NUMBER} .
            #put your Test cases
            echo 'Starting test cases'
            echo 'Creating Artefact'
            apk --update add ca-certificates wget python curl tar jq
            apk -Uuv add make groff less python py-pip
            pip install awscli
            $(aws ecr get-login --region $AWS_REGION --no-include-email)
            docker push ${DOCKER_REPO}:${BUILD_NUMBER}
            echo 'Start deploying'
            abc=${ENV}_cluster
            echo $abc
            CLUSTER_NAME=test-squareops-eks
            aws eks --region eu-central-1  update-kubeconfig --name ${CLUSTER_NAME}
            VERSION=v3.2.4
            echo $VERSION
            FILENAME=helm-${VERSION}-linux-amd64.tar.gz
            HELM_URL=https://get.helm.sh/${FILENAME}
            echo $HELM_URL
            curl -o /tmp/$FILENAME ${HELM_URL} \
            && tar -zxvf /tmp/${FILENAME} -C /tmp \
            && mv /tmp/linux-amd64/helm /bin/helm 
            helm upgrade --install node-demo ./helm --set image.repository=421320058418.dkr.ecr.eu-central-1.amazonaws.com/jenkins-demo --set image.tag=${BUILD_NUMBER}            
            '''
          } //script
        } //container
        }
      } //steps
}
// slack notification configuration
  // stage('Error') {
  //   // when doError is equal to 1, return an error
  //   when {
  //       expression { doError == '1' }
  //   }
  //   steps {
  //       echo "Failure :("
  //       error "Test failed on purpose, doError == str(1)"
  //   }
  // }
  // stage('Success') {
  //   // when doError is equal to 0, just print a simple message
  //   when {
  //       expression { doError == '0' }
  //   }
  //   steps {
  //       echo "Success :)"
  //   }
  // }
}
    // Post-build actions
  // post {
  //     always {
  //         slackSend channel: '#test123',
  //             color: COLOR_MAP[currentBuild.currentResult],
  //             message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} More info at: https://jenkins.squareops.com/blue/organizations/jenkins/$JOB_BASE_NAME/detail/$JOB_BASE_NAME/$BUILD_NUMBER"
  //     }
  // }
} //pipeline