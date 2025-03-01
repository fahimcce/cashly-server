"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", unique: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const Session = mongoose_1.default.model("Session", sessionSchema);
exports.default = Session;
