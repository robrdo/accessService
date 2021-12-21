import colors from "colors";
import express from 'express';
import "reflect-metadata";
import { nameof } from "ts-simple-nameof";
import { container } from 'tsyringe';
import DbProvider from '../dataAccessLayer/dbProvider';
import AppBase from "../infra/appBase";
import { AppSettings, AppSettingsProvider } from "../infra/config/appSettings";
import AccessServiceController from './controllers/accessServiceController';
import HealthController from "./controllers/healthController";
import PlainAuthentithicationMiddleware from './middleWare/authMiddleware';
import errorMiddleware from './middleWare/errorMiddleware';

export class AccessServiceApp extends AppBase {

    constructor() {
        super();
    }

    public async init(): Promise<void> {
        console.log(colors.yellow('initing the application'))
        let db: DbProvider = await this.initDb();
        console.log(colors.yellow('db init successfully'));
        await DiRegistration.registerDependencies(db);
        this.initializeMiddlewares();
        this.initializeControllers();
        this.app.use(errorMiddleware);
    }

    private async initDb(): Promise<DbProvider> {
        let db = new DbProvider();
        await db.initialize().catch(ex => { throw new Error("couldn't connect to db") });
        return db;
    }

    private initializeMiddlewares() {
        //inject
        let authService = new PlainAuthentithicationMiddleware();
        this.app.use(authService.authenticateRequest);
        this.app.use(express.json());
    }

    private initializeControllers() {
        this.registerController(AccessServiceController, 'accessservice');
        this.registerController(HealthController, 'health');
        console.log("app is started with following routes:");
        console.log(this.app._router.stack.filter(r => r.route).map(r => r.route.path));
    }
}

class DiRegistration {
    static async registerDependencies(db: DbProvider) {
        container.registerInstance(nameof(DbProvider), db);
        let appSettings = await AppSettingsProvider.GetSettings(db);
        container.registerInstance(nameof(AppSettings), appSettings);
    }
}