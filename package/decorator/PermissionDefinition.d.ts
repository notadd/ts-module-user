import 'reflect-metadata';
export declare const PERMISSION_DEFINITION = "userpm:permission_definition";
export declare function PermissionDefinition(definitions: {
    name: string;
    description: string;
}[]): (target: object, key?: any, descriptor?: any) => any;
