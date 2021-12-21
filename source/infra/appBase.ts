import express, { Application } from "express";
import { container, InjectionToken } from "tsyringe";
import AccessServiceController from "../serverLayer/controllers/accessServiceController";
import { ROUTES } from "./routing/routingConstants";
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

    //get instance from container and try to init routes for it
    registerController<T>(controllerType: InjectionToken<T>, serviceName: string) {
        let controller = container.resolve(controllerType);
        if (!controller) {
            console.log('cannot resolve controller');
            return;
        }
        this.buildRouting(controller, serviceName);
    };

    //#region routing

    //todo: move to other class, check for route duplications
    /**
     * reads metadata from controller decorators in order to build dynamic routing
     * @param controller  - instance of controller
     * @param serviceName - name in the routing
     */
    private buildRouting(controller: Object, serviceName: string) {
        let methods = Reflect.getMetadata(ROUTES, controller);
        let casted = methods as RouteDescriptor[];
        if (!methods || !casted) {
            console.log("cannot init routes for controllers")
            return;
        }

        casted.forEach(element => {
            let rdesc = element as RouteDescriptor;
            //locate and bind func with resolved instance
            let routeMethod = controller[rdesc.methodName].bind(controller);

            if (!routeMethod) {
                console.log("cannot set method for controller")
                return;
            }

            //checking if method is default
            if (rdesc.isDefault) {
                this.app.get(`/`, routeMethod);
                return;
            }

            //based on route configuration build routes for app
            switch (rdesc.method) {
                case RouteTypes.Get:
                    this.app.get(`/${serviceName}/${rdesc.route}`, routeMethod)
                    break;
                case RouteTypes.Delete:
                    this.app.delete(`/${serviceName}/${rdesc.route}`, routeMethod)
                    break;
                case RouteTypes.Post:
                    this.app.post(`/${serviceName}/${rdesc.route}`, routeMethod)
                    break;
                case RouteTypes.Put:
                    this.app.put(`/${serviceName}/${rdesc.route}`, routeMethod)
                    break;
                default:
                    break;
            }
        });

        //cleaning up memory from metadata
        Reflect.deleteMetadata(ROUTES, controller);

        //#endregion
    }
}
