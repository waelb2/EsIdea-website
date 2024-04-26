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
const ndmailer_1 = __importDefault(require("../config/ndmailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendInvitationEMail = (coordinator, userId, email, projectId, projectName, invitationId) => __awaiter(void 0, void 0, void 0, function* () {
    const linkPayload = {
        userId,
        email,
        projectId,
        invitationId
    };
    const link_token = jsonwebtoken_1.default.sign(linkPayload, process.env.JWT_SECRET_EMAIL, {
        expiresIn: '3d'
    });
    const invitationLink = ` http://localhost:3000/invitation/accept?token=${link_token}`;
    const message = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: `You are invited to join this project <<${projectName}>>`,
        html: `<p> ${coordinator} has shared the project ${projectName} with you:</p>
        <form action="${invitationLink}" method="post">
            <button type="submit">Accept Invitation</button>
        </form>`
    };
    try {
        yield ndmailer_1.default.sendMail(message);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
exports.default = sendInvitationEMail;
