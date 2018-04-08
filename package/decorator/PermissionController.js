"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.PERMISSION_CONTROLLER_OR = 'userpm:permission_controller_or';
exports.PERMISSION_CONTROLLER_AND = 'userpm:permission_controller_and';
function PermissionController(names, mode = 'and') {
    return (target, key, descriptor) => {
        if (descriptor) {
            let or_exist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_OR, descriptor.value) || [];
            let and_exist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_AND, descriptor.value) || [];
            if (mode === 'or') {
                Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_OR, names.concat(or_exist), descriptor.value);
            }
            else if (mode === 'and') {
                Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_AND, names.concat(and_exist), descriptor.value);
            }
            else {
                throw new Error('mode参数不正确');
            }
            return descriptor;
        }
        let or_exist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_OR, target) || [];
        let and_exist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_AND, target) || [];
        if (mode === 'or') {
            Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_OR, names.concat(or_exist), target);
        }
        else if (mode === 'and') {
            Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_AND, names.concat(and_exist), target);
        }
        else {
            throw new Error('mode参数不正确');
        }
        return target;
    };
}
exports.PermissionController = PermissionController;
