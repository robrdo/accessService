import "reflect-metadata";
import express, { } from 'express';
import PlainAuthentithication from '../commonServices/authService';
import AccessServiceController from './controllers/accessServiceController';
import errorMiddleware from './middleWare/errorMiddleware';
import DbProvider from '../dataAccessLayer/dbProvider';
import { container } from 'tsyringe';
import { nameof } from "ts-simple-nameof";
import { AppSettings, AppSettingsProvider } from "../commonServices/helpers/appSettings";
import AppBase from "../infra/appBase";

export class AccessServiceApp extends AppBase {

    constructor() {
        super();
    }

    public async init(): Promise<void> {
        let db: DbProvider = await this.initDb();
        console.log('db init successfully');
        await DiRegistration.registerDependencies(db);
        console.log('actualy inited 2');
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    private async initDb(): Promise<DbProvider> {
        let db = new DbProvider();
        await db.initialize().catch(ex => { throw new Error("couldn't connect to db") });
        return db;
    }

    private initializeMiddlewares() {
        //inject
        let authService = new PlainAuthentithication();
        this.app.use(authService.authenticateRequest);
        //this.app.use(acceptAccessHeaderMiddleware);
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(errorMiddleware);
    }

    private initializeControllers() {
        this.registerController(AccessServiceController, 'accessService');
    }
}

class DiRegistration {
    static async registerDependencies(db: DbProvider) {
        container.registerInstance(nameof(DbProvider), db);
        let appSettings = await AppSettingsProvider.GetSettings(db);
        container.registerInstance(nameof(AppSettings), appSettings);
    }
}