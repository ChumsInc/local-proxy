import "dotenv/config.js";
import express from 'express';
import bodyParser from "body-parser";
import compression from 'compression';
import * as http from "node:http";
import Debug from 'debug';
import commandLineArgs from "command-line-args";
import b2bServerRouter from "./lib/site-b2b-server.js";
import HttpProxyRules from "http-proxy-rules";
import {proxySettings} from './proxy-settings.js'

const defaultRules = new HttpProxyRules({
    rules: {},
});

let rules = defaultRules;

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
case 'b2b-server':
case 'intranet':
case 'b2b':
case 'api-operations':
case 'api-partners':
case 'api-sales':
case 'api-shopify':
case 'api-timeclock':
    options.port = options.port ?? proxySettings[options.site]?.listen;
    app.use((req, res, next) => {
        const target = proxySettings[options.site]?.rules?.match(req);
        if (target) {
            let ignorePath = false;
            if (proxySettings[options.site]?.ignorePath) {
                ignorePath = proxySettings[options.site].ignorePath(req.path);
            }
            return proxySettings[options.site]?.proxy.web(req, res, {target, ignorePath});
        }
        next();
    })
    break;
default:
    debug(`Invalid site for proxy configuration()`,);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res) => {
    res.status(404).send('Sorry, not found!');
})

const server = http.createServer(app);
server.listen(options.port, 'localhost');
debug(`listening on localhost: ${options.port}`);
