import express, { Application, Express } from 'express';
import * as bodyParser from 'body-parser';
import { PlainAuthentithication } from './commonServices/authService';
import AccessServiceController from './serverLayer/controllers/accessServiceController';
import { TokenService } from './businessLayer/tokenService';
import JWTService from './commonServices/jwtService';
import ApiKeyService from './businessLayer/apiKeyService';
import { AppSettings, AppSettingsProvider } from "./helpers/appSettings";
import errorMiddleware from './serverLayer/middleWare/errorMiddleware';
import DbProvider from './dataAccessLayer/dbProvider';
import { resolve } from 'path/posix';
//import { injectable } from 'tsyringe';

//@scoped (Lifecycle.ContainerScoped)
//@injectable()
class App {
    app: Application;
    port: number;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        let ctrl: AccessServiceController = this.createMainController();
        this.initializeControllers(ctrl);
    }

    private initializeMiddlewares() {
        //inject
        let authService = new PlainAuthentithication();
        this.app.use(authService.authenticateRequest)
        /** Parse the request */
        this.app.use(express.urlencoded({ extended: false }));
        /** Takes care of JSON data */
        //TODO: WHICH ONE
        this.app.use(express.json());
        this.app.use(bodyParser.json());
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.expressRouter);
        });
    }

    public start(port: number) {
        this.app.listen(port, () => {
            console.log(`App listening on the port ${port}`);
        });
    }

    //temp
    private createMainController(): AccessServiceController {
        //temp
        let db = new DbProvider(); // factory
        new Promise(db.initialize).then(() => console.log("initin"));
        let settings: AppSettings = null;
        AppSettingsProvider.GetInstance(db).then(value => settings = value);
        console.log("ops");
        let jwtTokenService = new JWTService(settings);
        let apiKeyService = new ApiKeyService(settings);
        let ctrl = new AccessServiceController(apiKeyService, new TokenService(jwtTokenService));
        console.log('AHTUNG!, before method');
        /*ctrl.getTokens(null, null);
        ctrl.getTokens(null, null);*/
        return ctrl;
    }
}

export default App;



/*var ctrl = new Controller();
const route = router.get('/', ctrl.getAll);*/
/** Logging */
//router.use(morgan('dev'));


//move to container


/** RULES OF OUR API *//*
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});*/

/** Routes */
//router.use('/', routes);

/** Error handling *//*
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});*/

