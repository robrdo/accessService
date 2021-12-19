import express, { Application } from "express";
import { container, InjectionToken } from "tsyringe";
import { serialize } from "v8";
import { CONTROLLERPATH, ROUTES } from "./routing/routingConstants";
import { RouteDescriptor, RouteTypes } from "./routing/routingTypes";

//baseclass for server container
export default abstract class AppBase {
    //todo: close it in a future and let access to
    //child through the method in order to control order flow
    protected app: Application;
    port: number;

    constructor() {
        this.app = express();
    }

    start(port: number): void {
        this.app.listen(port, () => {
            console.log(`App listening on the port ${port}`);
        });
    }

    registerController<T>(controllerType: InjectionToken<T>, serviceName: string) {
        let controller = container.resolve(controllerType);
        this.buildRouting(controller, serviceName);
    };

    registerMiddleware() {

    };

    //#region routing

    //todo: move to other class, check for route duplications
    /**
     * reads metadata from controller in order to build dynamic routing
     * @param controller 
     * @param serviceName 
     * @returns 
     */
    private buildRouting(controller: Object, serviceName: string) {
        let methods = Reflect.getMetadata(ROUTES, controller);
        let casted = methods as RouteDescriptor[];
        if (!methods || !casted) {
            //logger.log("cannot init routes for controllers")
            return;
        }


        console.log(`controller ${serviceName} has started routes: \n ${JSON.stringify(casted)}`);

        casted.forEach(element => {
            let rdesc = element as RouteDescriptor;

            switch (rdesc.method) {
                case RouteTypes.Get:
                    this.app.get(`/${serviceName}/${rdesc.route}`, rdesc.methodInvocation)
                    break;
                case RouteTypes.Delete:
                    this.app.delete(`/${serviceName}/${rdesc.route}`, rdesc.methodInvocation)
                    break;
                case RouteTypes.Post:
                    this.app.post(`/${serviceName}/${rdesc.route}`, rdesc.methodInvocation)
                    break;
                case RouteTypes.Put:
                    this.app.put(`/${serviceName}/${rdesc.route}`, rdesc.methodInvocation)
                    break;
                default:
                    break;
            }
        });

        Reflect.deleteMetadata(ROUTES, controller);

        //#endregion
    }
}
