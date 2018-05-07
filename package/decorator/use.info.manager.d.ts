export declare const PERMISSION_CONTROLLER_OR = "user:permission_controller_or";
export declare const PERMISSION_CONTROLLER_AND = "user:permission_controller_and";
export declare function Can(names: Array<string>, mode?: "or" | "and"): (target: object, key?: any, descriptor?: any) => any;
