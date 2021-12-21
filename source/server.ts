import { exit } from "process";
import "reflect-metadata";
import { AccessServiceApp } from './serverLayer/app';
require('dotenv').config();

console.log('starting the application')
process.on('uncaughtException', (err, origin) => {
  console.log('unhandled happened. stopping the server...' + err);
  exit(1);
});

const app = new AccessServiceApp();
const PORT: any = process.env.PORT || 6060;
app.init().then(() => app.start(PORT));
