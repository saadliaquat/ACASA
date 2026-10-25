import express from 'express';
import { generateMalware, fetchMalware, generatePrivilegedAccess, generateISMS, fetchISMS} from "../controllers/policy_generation.js"

const app = express.Router();

app.post('/generate_malware', generateMalware);
app.get('/fetch_malware', fetchMalware);
app.post('/generate_privileged_access', generatePrivilegedAccess);
app.post('/generate_ISMS', generateISMS);
app.get('/fetch_ISMS', fetchISMS);

export default app;