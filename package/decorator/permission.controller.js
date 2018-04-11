"use strict";
exports.__esModule = true;
require("reflect-metadata");
exports.PERMISSION_CONTROLLER_OR = "userpm:permission_controller_or";
exports.PERMISSION_CONTROLLER_AND = "userpm:permission_controller_and";
function PermissionController(names, mode) {
    if (mode === void 0) { mode = "and"; }
    return function (target, key, descriptor) {
        if (descriptor) {
            var or_exist_1 = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_OR, descriptor.value) || [];
            var and_exist_1 = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_AND, descriptor.value) || [];
            if (mode === "or") {
                Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_OR, names.concat(or_exist_1), descriptor.value);
            }
            else if (mode === "and") {
                Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_AND, names.concat(and_exist_1), descriptor.value);
            }
            else {
                throw new Error("mode参数不正确");
            }
            return descriptor;
        }
        var or_exist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_OR, target) || [];
        var and_exist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_AND, target) || [];
        if (mode === "or") {
            Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_OR, names.concat(or_exist), target);
        }
        else if (mode === "and") {
            Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_AND, names.concat(and_exist), target);
        }
        else {
            throw new Error("mode参数不正确");
        }
        return target;
    };
}
exports.PermissionController = PermissionController;
