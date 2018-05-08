"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./user.module"));
__export(require("./decorator/can.decorator"));
__export(require("./decorator/permissions.decorator"));
var user_component_provider_1 = require("./export/user.component.provider");
exports.UserComponent = user_component_provider_1.UserComponent;
exports.UserComponentToken = user_component_provider_1.UserComponentToken;
var user_entity_1 = require("./model/user.entity");
exports.User = user_entity_1.User;

//# sourceMappingURL=index.js.map
