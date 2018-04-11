"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.PERMISSION_DEFINITION = "userpm:permission_definition";
function PermissionDefinition(definitions) {
    return (target, key, descriptor) => {
        if (descriptor) {
            const exist = Reflect.getMetadata(exports.PERMISSION_DEFINITION, target, key) || [];
            Reflect.defineMetadata(exports.PERMISSION_DEFINITION, definitions.concat(exist), target, key);
            return descriptor;
        }
        const exist = Reflect.getMetadata(exports.PERMISSION_DEFINITION, target) || [];
        Reflect.defineMetadata(exports.PERMISSION_DEFINITION, definitions.concat(exist), target);
        return target;
    };
}
exports.PermissionDefinition = PermissionDefinition;
