import express from 'express';
import bodyParser from 'body-parser';

import { pingReqHandler, indexPageReqHandler, getVmInfoReqHandler, toggleVmReqHandler } from './req-handlers';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/ping', pingReqHandler);
app.get('/', indexPageReqHandler);
app.get('/vm', getVmInfoReqHandler);
app.post('/vm/toggle', toggleVmReqHandler);

export { app };
