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

    registerController<T>(controllerType: InjectionToken<T>, serviceName:string) {
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
    private buildRouting(controller: Object, serviceName:string) {
        let name = controller.constructor.name;
        let path = Reflect.getMetadata(CONTROLLERPATH, controller);
        if (!path) {
            console.error("no metadata presents on " + typeof controller);
            console.error("no metadata presents on " + name);
        }

        let methods = Reflect.getMetadata(ROUTES, controller);
        console.log("methods");
        if (!methods)
            return;
        console.log(JSON.stringify(methods));
        let casted = methods as RouteDescriptor[];
        console.log(casted);

        (methods as []).forEach(element => {
            let rdesc = element as RouteDescriptor;
            console.log("casted2", JSON.stringify(rdesc));

            switch (rdesc.method) {
                case RouteTypes.Get:
                    this.app.get(name + "/" + rdesc.route, rdesc.methodInvocation)
                    break;
                case RouteTypes.Delete:
                    this.app.delete(name +"/" + rdesc.route, rdesc.methodInvocation)
                    break;
                case RouteTypes.Post:
                    this.app.post(name + "/" + rdesc.route, rdesc.methodInvocation)
                    break;
                case RouteTypes.Put:
                    this.app.put(name + "/" + rdesc.route, rdesc.methodInvocation)
                    break;
                default:
                    break;
            }
        });
        
        Reflect.deleteMetadata(ROUTES, controller);

        //#endregion
    }
}
