import reflect, { } from 'reflect-metadata';
import { Controller, RouteDescriptor, RouteTypes } from '../controller';
import { decorateRoute } from './methodDecorator';

export function updateApi(path: string) {
    return function (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) {
        let routeDescriptor: RouteDescriptor = {
            method: RouteTypes.Update,
            route: path
        }
        decorateRoute(routeDescriptor, target, propertyKey, descriptor);
    };
}