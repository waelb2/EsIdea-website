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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoudules = void 0;
const moduleModel_1 = require("./moduleModel");
const getMoudules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modules = yield moduleModel_1.Module.find({});
        return res.status(200).json({
            modules
        });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getMoudules = getMoudules;
