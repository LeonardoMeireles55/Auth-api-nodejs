<h1 align="center">
    Auth-api-nodejs
</h1>

## Technologies

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

## Description
This project, is a Node.js and Express-based authentication API. It uses JWT, Bcrypt, and Postgres via TypeORM. Additional features include email handling with Nodemailer and in-memory caching. The code is written in TypeScript and includes unit tests with Jest.

## Steps to Run this Project:

### Install Dependencies
Run the following command to install the project dependencies:

```bash
yarn install
```

### Create Environment Variables
Create a .env file in the project root directory with the following template:

### Database Configuration
DB_HOST=  
DB_PORT=  
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

### Email Configuration
EMAIL_USER=  
EMAIL_PASS=  

### Node Environment
NODE_ENV=dev

### JWT Secret
JWT_SECRET=

# Database Settings
Navigate to the data-source.ts file and configure your database settings.

# Start the Project
Run the following command to start the project:

```bash
yarn start
```
# Start the Project with DOCKER
```bash
docker compose up
```
