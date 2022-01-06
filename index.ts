import express from "express";

// Class Initilizaers=========================
// Server Init
const app = express(); // Server Init
//Server Options================================
// Converts body to json Automatically
app.use(express.json());
const PortNumber:number = 3001;
app.listen(PortNumber,  ()=>console.log("+++++++++++++ Server Started ++++++++++++++++"));
//==============================================

