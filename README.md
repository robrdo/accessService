# accessService
microservice for supplying authorization for automated applications

##Requirements

Node > v16.13.1
Git
Sqlite

##Common setup

Clone the repo and install the dependencies.
1) git clone https://github.com/robrdo/accessService.git
2) cd the-example-app.nodejs
3) npm install 

Prepare config

create file with an empty name and extension .env.
Fill it with the following content:

DB_PATH=:memory: or use a local path
PORT=7070
JWT_SECRET


To start the express server:
npm run start:dev






Few words about the code
