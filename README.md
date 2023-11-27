# WasteWise
Repository for WasteWise, a a Bangkit 2023 Batch 2 Capstone Project

## Installation
1. Add .env file to the root directory
2. Add the following variables to the .env file
```
FIREBASE_ADMIN_CONFIG=<name of firebase admin config file>
FIREBASE_CLIENT_CONFIG=<name of firebase client config file>
FIREBASE_STORAGE_BUCKET=<firebase storage bucket name>
FIREBASE_API_KEY=<firebase api key>
```
3. Add the firebase admin config file to the Model directory
4. Add the firebase client config file to the Model directory
5. npm install
6. npm start

## To Push Docker Image to Google Cloud
1. Create a service account in Google Cloud with cloud storage admin role (first push ) or storage object admin role (subsequent pushes)
2. Download the service account key as a json file
3. Rename the json file to image-pusher-token.json and place it in the root directory
4. Login to docker with the service account key
```sh
Get-Content image-pusher-token.json | docker login -u _json_key --password-stdin https://asia.gcr.io
```
5. Build the docker image
```sh
docker build -t asia.gcr.io/<project-id>/<image-name>:<tag> .
```
6. Push the docker image
```sh
docker push asia.gcr.io/<project-id>/<image-name>:<tag>
```