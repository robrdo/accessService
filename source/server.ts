/** source/server.ts */
///import http from 'http';
import express, { Express } from 'express';
import App from './app';
import { ApiKeyService } from './businessLayer/apiKeyService';
import { AccessServiceController } from './controllers/accessServiceController';
import { DbProvider } from './dal/dbProvider';
import { PlainAuthentithication } from './services/authService';
import { JWTService } from './services/jwtService';
import { TokenService } from "./businessLayer/tokenService";
//import morgan from 'morgan';
const app = new App();

/*
let jwtService = new JWTService();
let db = new DbProvider(jwtService);
db.initialize().then(()=>console.log("initin"));
console.log("ops");

let ctrl = new AccessServiceController(null, new TokenService(jwtService));*/
console.log('AHTUNG!, before method');
/*ctrl.getTokens(null, null);
ctrl.getTokens(null, null);*/

const PORT: any = process.env.PORT ?? 6060;
app.start(PORT);