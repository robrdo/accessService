
//tsrynge wraps controller class because of DI usage. Explore later why I don't get the required class in here
/*
export function controller(path: string) {
  return function (constructor: Function) {
    let controllerName = path.toLowerCase() || constructor.caller.name.toLowerCase();
    console.log("cname" + controllerName);
    console.log("cname" + constructor);
    let lastIndexof = controllerName.indexOf("controller");
    let transformed = controllerName.substring(0, lastIndexof > 0 ? lastIndexof : controllerName.length);
    Reflect.defineMetadata(CONTROLLERPATH, transformed, constructor.caller);
  }
}*/