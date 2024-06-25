"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotevnv = require("dotenv");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
dotevnv.config();
if (!process.env.PORT) {
    console.log("No port value specified...");
}
var PORT = parseInt(process.env.PORT, 10);
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.listen(PORT, function () {
    console.log("Server is listening on port ".concat(PORT));
});


SEPOLIA="https://arbitrum-sepolia.infura.io/v3/d81e95e22d1d4536bae34f79c9a3528f"