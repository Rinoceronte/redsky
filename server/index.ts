import express = require('express');
import * as http from 'http';
// const router = require ('./router');
import {UsersRoutes} from './routes.config';
import {CommonRoutesConfig} from './common.routes.config';
// import path from 'path';


const app:express.Application = express();
const server: http.Server = http.createServer(app);
const port = 4000;
const routes: Array<CommonRoutesConfig> = [];

app.use(express.json());

routes.push(new UsersRoutes(app));
// app.use("/", router);

const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage); 
});

server.listen(port, () => console.log('running on 4000'));