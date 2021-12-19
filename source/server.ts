/** source/server.ts */
import express, { Express } from 'express';
import App from './app';

const app = new App();
const PORT: any = process.env.PORT ?? 6060;
app.start(PORT);