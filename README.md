# accessService
microservice for supplying authorization for automated applications

## Requirements

Node > v16.13.1
Git
Sqlite

## Common setup

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



### Api 

As in the task, auth is simple check for userId. I placed it in the header, so every request should contain 

- header userid = 777.

Note: in the logic, since we don't have real auth, I suppose what user exists, so do not create key with different userid. Applies only for create api key

 - Create API key POST http://localhost:7070/accessService
 {
	"permissions":["read", "modify"]
  }

creates user with required permissions, validates if required permission higher than user's. 
Api key is for pair set userid + permissions, user cannot have more than one key with same permissions

Get tokens GET http://localhost:7070/accessService - simply brings all token

Delete key DELETE http://localhost:7070/accessService/ {api key} - set status as revoke to the api key, validates existance in db, and won't let to revoke if issuer.UserId != requested.Userid

Get JWT token  POST http://localhost:7070/accessService/authentithicate/ - issue JWT token
add to headers to execute 
- api-key = generated apikey
validates api-key, added the setting to db if only the issuer of api-key can authentificate it

### Example scenarion
1. get api key
2. authorise it
3. revoke
4. get tokens history

### Few words about the code

Project structure: 

![image](https://user-images.githubusercontent.com/68990564/146859143-c111d385-e068-4a45-8e4e-1369d7b01ae4.png)

Entry point is app.ts which is initialize controllers in folder server layers. All the web server logic including middleware lies in ServerLayer folder. Controllers have zero business logic, only validates param and calls required services which lies in folder BusinessLayer(BL). BL services are getting the access to the db through the DataAccesLayer (dal). I used ORM Sequelize. In ideal situation I could've build the generic repository to access through it required models.

Server uses DI container to resolve dependencies and inject them in constructor. 
Routing is build dynamically via decorators in convinient way. Used some simple magic with Reflect.Metadata and late binding controller with it's context.

![image](https://user-images.githubusercontent.com/68990564/146859960-2d47dfcf-a0b0-4375-a534-ecb09b027bf9.png)



