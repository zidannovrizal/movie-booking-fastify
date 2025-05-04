"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = 3001; // Fixed port for backend
app_1.default
    .listen({ port: PORT, host: "0.0.0.0" })
    .then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
})
    .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
});
