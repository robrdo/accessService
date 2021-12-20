import "reflect-metadata";
import { AccessServiceApp } from './serverLayer/app';
require('dotenv').config();

const app = new AccessServiceApp();
const PORT: any = process.env.PORT || 6060;
app.init().then(() => app.start(PORT));