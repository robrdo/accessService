import { } from 'reflect-metadata';

export const IGNOREAUTH = 'ignoreauth';

export function ignoreAuth() {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
       let ctrl = target.constructor.name
        Reflect.defineMetadata(IGNOREAUTH, ctrl, target);
    };
}