# CatarAct API

## Overview
API Server for serving CatarAct APK requests. This repository is part of [CatarAct](https://github.com/cataract-bangkit) Google Bangkit Capstone Project.

## How to Run Locally

### Prerequisites
- Linux OS (prefered)
- `nodejs`
- `yarn` package manager
- `PostgreSQL` database
- A Google Cloud Project with a public Google Cloud Storage Bucket configured
- A machine learning model in Tensorflow.js format, preferably stored in Google Cloud Storage Bucket

### Step by Step
- Clone this repository.
- Create a `.env` file in the root folder. Fill it with:
```
APP_PORT= # port to run the server (e.g. 3001)
DATABASE_URL= # postgresql database connection url
JWT_SECRET= # a secret text for signing JWT
MODEL_PUBLIC_URL= # a url to ML model JSON file in Tensorflow.js format
GCS_BUCKET= # Google Cloud Storage Bucket name
PROJECT_ID= # Google Cloud Project ID
GCS_CREDENTIALS= # Google Cloud Storage Service Account credentials key in stringified JSON format.
```
- Run `yarn` to install dependencies.
- Run `yarn start:dev` to run the development server.

### Deployment
A `Dockerfile` is available on the root folder for containerization. The docker image can be used for deployment such as Cloud Run or a remote VM.

### API
API documentation available on [GDocs](https://docs.google.com/document/d/14-z-A81R5Q6ayDlHV15_qKiDLNk82Dks9zUBCzACMc0/edit?usp=sharing).

### Acknowledgement
This project is developed by [Bangkit CatarAct](https://github.com/cataract-bangkit) team, specifically [bonaventuragal](https://github.com/bonaventuragal) and [aidahputri](https://github.com/aidahputri).
