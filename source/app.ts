import express, { Application, Express } from 'express';
import * as bodyParser from 'body-parser';
import { PlainAuthentithication } from './services/authService';
import { AccessServiceController } from './controllers/accessServiceController';
import { TokenService } from './businessLayer/tokenService';
import { JWTService } from './services/jwtService';
import { ApiKeyService } from './businessLayer/apiKeyService';
import { AppSettings } from "./helpers/appSettings";
import errorMiddleware from './serviceLayer/middleWare/errorMiddleware';
//import { injectable } from 'tsyringe';

//@scoped (Lifecycle.ContainerScoped)
//@injectable()
class App {
    public app: Application;
    public port: number;

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
        let jwtService = new JWTService();
        //todo 
        let settings = null;//new AppSettings();
        let ctrl = new AccessServiceController(new ApiKeyService(settings), new TokenService(jwtService));
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

