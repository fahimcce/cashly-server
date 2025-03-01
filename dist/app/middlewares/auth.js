"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const auth = (...rules) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError_1.default(401, "You are not authorized");
            }
            const varifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt_access_token);
            req.user = varifiedUser;
            if (rules.length && !rules.includes(varifiedUser.role)) {
                throw new ApiError_1.default(403, "Forbidden");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = auth;
