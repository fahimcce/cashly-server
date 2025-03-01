"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const Session_model_1 = __importDefault(require("../modules/Auth/Session.model"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            console.log("No token found!"); // 🔍 Debugging line
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
        console.log("Decoded token:", decoded); // 🔍 Debugging line
        const session = yield Session_model_1.default.findOne({ userId: decoded.userId });
        if (!session || session.token !== token) {
            console.log("Session expired or token mismatch!"); // 🔍 Debugging line
            return res
                .status(401)
                .json({ message: "Session expired. Please log in again." });
        }
        req.user = { userId: decoded.userId }; // ✅ Correctly set `userId` on `req.user`
        console.log("req.user set in middleware:", req.user); // 🔍 Debugging line
        next(); // ✅ Call next() to continue to logout controller
    }
    catch (error) {
        console.error("JWT Verification Error:", error); // 🔍 Debugging line
        res.status(401).json({ message: "Invalid token." });
    }
});
exports.authenticate = authenticate;
