import 'reflect-metadata';
export declare const PERMISSION_CONTROLLER_OR = "userpm:permission_controller_or";
export declare const PERMISSION_CONTROLLER_AND = "userpm:permission_controller_and";
export declare function PermissionController(names: string[], mode?: 'or' | 'and'): (target: object, key?: any, descriptor?: any) => any;
