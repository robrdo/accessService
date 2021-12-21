import { singleton } from "tsyringe";
import { Permissions } from "../../data/models/dto";
import "reflect-metadata";

@singleton()
export default class PermissionsHelper {
  parseFromArray(toParse: string[], ignoreCase: boolean = false): Permissions {
    if (ignoreCase) {
      toParse = ignoreCase ? toParse.map(x => x.toLowerCase()) : toParse;
    }
    let result: any;
    Object.keys(Permissions).map(key => {
      if (toParse.includes(ignoreCase ? key.toLowerCase() : key)) {
        result |= Permissions[key];
      }
    });
    return result as Permissions;
  }

  parseBack(permissions: Permissions): string[] {
    if (!permissions) {
      return [];
    }
    let result: string[] = [];
    if ((permissions & Permissions.Create) == Permissions.Create) {
      result.push(Permissions[Permissions.Create]);
    }
    if ((permissions & Permissions.Delete) == Permissions.Delete) {
      result.push(Permissions[Permissions.Delete]);
    }
    if ((permissions & Permissions.Modify) == Permissions.Modify) {
      result.push(Permissions[Permissions.Modify]);
    }
    if ((permissions & Permissions.Read) == Permissions.Read) {
      result.push(Permissions[Permissions.Read]);
    }
    return result || [Permissions[Permissions.None]];
  }
}