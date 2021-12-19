/** source/server.ts */
import express, { Express } from 'express';
import "reflect-metadata";
import { AccessServiceApp } from './serverLayer/app';

const app = new AccessServiceApp();
const PORT: any = process.env.PORT ?? 6060;
app.init().then(() => app.start(PORT));