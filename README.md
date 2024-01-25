# Ketflix
Devops &amp; Microservices Project.

The backend of this project is written in Typescript and is setup on a serverless architecture. 
It uses the following microservices:
 - API Gateway for endpoints
 - Lambda as main backend code host
 - DynamoDB for database
 - S3 for File storage

For deployment, AWS SAM (Serverless Application Model) is used. A template.yaml File is created which defines all the resources that are to be required by the application.
It should be noted that using Typescript with AWS SAM is a beta feature; so while building, the command `sam build --beta-features`  is needed.
Once built, the application is deployed using the command `sam deploy`, which use AWS CloudFormation to create the resources required by the App.

The Frontend has been written in HTML and Javascript with styling in CSS; and it is hosted on Github pages. When commits are made, they are autodeployed to Github Pages.
