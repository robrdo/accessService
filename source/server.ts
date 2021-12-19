/** source/server.ts */
import express, { Express } from 'express';
import Server from './app';

const app = new Server();
const PORT: any = process.env.PORT ?? 6060;
app.start(PORT);