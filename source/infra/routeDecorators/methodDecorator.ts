import reflect, { } from 'reflect-metadata';
import { Controller, RouteDescriptor, RouteTypes } from '../controller';

export function decorateRoute(route: RouteDescriptor, target: Controller, propertyKey: string, descriptor: PropertyDescriptor) {
    //TODO: WHAT THE ACTUA L WAY
    /*if (target != undefined || target !== undefined || target != null || target !== null){
        target.routes.push(route);
    }*/
    Controller.routes.push(route);
}