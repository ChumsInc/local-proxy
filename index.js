import "dotenv/config.js";
import express from 'express';
import bodyParser from "body-parser";
import compression from 'compression';
import * as http from "node:http";
import Debug from 'debug';
import commandLineArgs from "command-line-args";
import b2bRouter from "./lib/site-b2b.js";
import b2bServerRouter from "./lib/site-b2b-server.js";
import apiOperationsRouter from "./lib/api-operations.js";
import intranetRouter from "./lib/site-intranet.js";
import apiPartnersRouter from "./lib/api-partners.js";
import apiSalesRouter from "./lib/api-sales.js";
import apiShopifyRouter from "./lib/api-shopify.js";

const debug = Debug('local-proxy:index');

const optionDefinitions = [
    {name: 'site', alias: 's', type: String},
    {name: 'port', type: Number},
];
const options = commandLineArgs(optionDefinitions);
if (!options.port) {
    options.port = process.env.PORT;
}
console.log('options', options);
const app = express();

app.locals.pretty = true;
app.set('json spaces', 2);

app.use(compression());
app.use((req, res, next) => {
    debug(req.method, req.url);
    next();
});

switch (options.site) {
case 'intranet':
    app.use(intranetRouter);
    break;

case 'b2b':
    app.use(b2bRouter);
    break;

case 'b2b-server':
    app.use(b2bServerRouter);
    break;

case 'api-operations':
    options.port = 8080;
    app.use(apiOperationsRouter);
    break;

case 'api-partners':
    options.port = 8080;
    app.use(apiPartnersRouter);
    break;
case 'api-sales':
    options.port = 8080;
    app.use(apiSalesRouter);
    break;
case 'api-shopify':
    options.port = 8080;
    app.use(apiShopifyRouter);
    break;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = http.createServer(app);
server.listen(options.port, 'localhost');
debug(`listening on localhost: ${options.port}`);
