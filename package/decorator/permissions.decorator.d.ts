import "reflect-metadata";
export declare const PERMISSION_DEFINITION = "user:permission_definition";
export declare function Permissions(definitions: Array<{
    name: string;
    description: string;
}>): (target: object, key?: any, descriptor?: any) => any;
