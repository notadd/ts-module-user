"use strict";
exports.__esModule = true;
require("reflect-metadata");
exports.PERMISSION_DEFINITION = "userpm:permission_definition";
function PermissionDefinition(definitions) {
    return function (target, key, descriptor) {
        if (descriptor) {
            var exist_1 = Reflect.getMetadata(exports.PERMISSION_DEFINITION, target, key) || [];
            Reflect.defineMetadata(exports.PERMISSION_DEFINITION, definitions.concat(exist_1), target, key);
            return descriptor;
        }
        var exist = Reflect.getMetadata(exports.PERMISSION_DEFINITION, target) || [];
        Reflect.defineMetadata(exports.PERMISSION_DEFINITION, definitions.concat(exist), target);
        return target;
    };
}
exports.PermissionDefinition = PermissionDefinition;
