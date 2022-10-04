import { ATableMetadata } from '../interfaces/atable.interface';
import { AObject } from '../classes/a.model';


export function ATable(metadata: ATableMetadata) {
    return function (target: any) {
        Reflect.defineMetadata('aobject', metadata, target);
    };
}

export function ATableType(objectType: new (t?: any) => AObject){
    return function (target: any){
        target.type = objectType;
    };
}