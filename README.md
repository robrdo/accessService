# accessService
microservice for supplying authorization for automated applications



What is Contentful?
Contentful provides a content infrastructure for digital teams to power content in websites, apps, and devices. Unlike a CMS, Contentful was built to integrate with the modern software stack. It offers a central hub for structured content, powerful management and delivery APIs, and a customizable web app that enable developers and content creators to ship digital products faster.

Requirements
Node > v16.13.1
Git
Sqlite

Common setup

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
