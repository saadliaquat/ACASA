import express from "express";
import cors from "cors";
import { employeeContract, aftertermContract, ndaContract } from "../controllers/contract_scripts.js";

const app = express.Router();

app.post('/employee_contract', employeeContract);
app.post('/afterterm_contract', aftertermContract);
app.post('/nda_contract', ndaContract);

export default app;