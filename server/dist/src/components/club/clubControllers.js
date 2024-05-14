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
exports.getClubs = void 0;
const clubModel_1 = require("./clubModel"); // Importing Club model
const getClubs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clubs = yield clubModel_1.Club.find({}); // Finding all clubs
        return res.status(200).json(clubs); // Sending clubs as JSON response
    }
    catch (error) {
        console.log(error); // Logging any errors
        return res.sendStatus(500); // Sending a 500 status code for internal server error
    }
});
exports.getClubs = getClubs;
