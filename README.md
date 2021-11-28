# Getting Started 

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

## Prerequisites

- nodejs  "^12"

## Installation

1. Clone the repo

        git clone https://github.com/karthikp249/assessment.git

2. Install NPM packages

        npm install

## API Documentaion :

**POST**       CSV upload

- url
`http://localhost:3000/upload`

**Body** form-data

- key
**datasheet**  						 C:/..../Downloads/data-sheet.csv

------------

**GET**			policy by username

- url
`http://localhost:3000/api/policyInfo?username=<username>`

------------

**POST**			create Job schedule

- url
`http://localhost:3000/api/createJob`

**Request Headers**

**content-type : application/json**

**Body**

    {
      "timestamp": "2021-11-29 09:50:55",
      "message": "Message from collection1"
    }
