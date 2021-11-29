# Getting Started 

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

## Prerequisites

- nodejs >= 14

## Installation

1. Clone the repo

        git clone https://github.com/karthikp249/assessment.git

2. Install NPM packages

        npm install
        npm install -g nodemon

3. Run server

        npm start

## API Documentaion :

## Task 1)

1) **POST**       CSV upload

- url
`http://localhost:3000/upload`

**Body** form-data

- key
**datasheet**  :						 C:/..../Downloads/data-sheet.csv

------------

2) **GET**			policy by username

- url
`http://localhost:3000/api/policyInfo?userName=<username>`

------------
3) **GET**			getAggDataByUsername

- url
`http://localhost:3000/api/userPolicyByUsername?userName=<username>`

------------

**GET**			getAggPolicyAll

- url
`http://localhost:3000/api/userAggPolicyAll`

------------

## Task 2

1) **POST**			create Job schedule

- url
`http://localhost:3000/api/createJob`

**Request Headers**

**content-type : application/json**

**Body**

    {
      "timestamp": "2021-11-29 09:50:55",
      "message": "Message from collection1"
    }

###### Note: Format for timestamps should be YYYY-MM-DD HH:mm:ss

------------
