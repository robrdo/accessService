import reflect, { } from 'reflect-metadata';
import { RouteDescriptor, RouteTypes } from '../routingTypes';
import { decorateRoute } from './methodDecorator';

export function deleteApi(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        decorateRoute(RouteTypes.Delete, path, target, propertyKey, descriptor);
    };
}