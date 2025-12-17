import "dotenv/config.js";
import express from 'express';
import bodyParser from "body-parser";
import compression from 'compression';
import * as http from "node:http";
import Debug from 'debug';
import commandLineArgs, {OptionDefinition} from "command-line-args";
import {
    b2bProxy,
    devAPIB2B,
    devAPIChums,
    devAPIImages,
    devAPIOperations,
    devAPIPartners,
    devAPIPayroll,
    devAPISage,
    devAPISales,
    devAPIShopify,
    devAPIUser,
    devB2BVersion,
    getListenPort,
    intranetProxy
} from "./get-proxy.js";


const debug = Debug('local-proxy:index');

debug('init()', process.argv);

const optionDefinitions: OptionDefinition[] = [
    {name: 'site', alias: 's', type: String},
    {name: 'port', type: Number},
    {name: 'local', type: String, multiple: true},
];
const options = commandLineArgs(optionDefinitions);
debug('options:', options);

if (!options.port) {
    options.port = getListenPort(options.site);
}
console.log('options', options);
const app = express();

app.locals.pretty = true;
app.set('json spaces', 2);

app.use(compression());
app.use((req, res, next) => {
    debug(options.site, req.method, req.url);
    next();
});

switch (options.site) {
    case 'b2b':
    case 'b2b:local':
        app.use('/api/user', b2bProxy());
        app.use('/api/sales', b2bProxy());
        if (options.local && options.local.includes('b2b-api')) {
            app.use('/api', devAPIB2B());
        }
        app.use('/api', b2bProxy())
        app.use('/node_modules', b2bProxy());
        app.use('/node-sage', b2bProxy());
        app.use('/sage', b2bProxy());
        app.use('/images', b2bProxy());
        app.use('/file', b2bProxy());
        app.use('/pdf', b2bProxy());
        app.use('/version', devB2BVersion());
        break;
    case 'b2b-server':
        app.use('/api/user', b2bProxy());
        app.use('/api/sales', b2bProxy());
        if (options.local && options.local.includes('b2b-api')) {
            app.use('/api', devAPIB2B());
        }
        app.use('/api', b2bProxy())
        app.use('/node_modules', b2bProxy());
        app.use('/node-sage', b2bProxy());
        app.use('/sage', b2bProxy());
        app.use('/images', b2bProxy());
        app.use('/file', b2bProxy());
        app.use('/pdf', b2bProxy());
        app.use('/version', devB2BVersion());
        break;
    case 'intranet':
        app.use('/api', intranetProxy());
        app.use('/apps', intranetProxy());
        app.use('/images', intranetProxy());
        app.use('/node_modules', intranetProxy());
        app.use('/pm-images', intranetProxy());
        app.use('/node-sage', intranetProxy());
        app.use('/sage', intranetProxy());
        app.use('/timeclock', intranetProxy());
        break;
    case 'inventory-entry':
        app.use('/api/operations', devAPIOperations());
        app.use('/api', intranetProxy());
        break;
    case 'b2b-api':
        app.use('/api/user', intranetProxy())
        app.use('/api/b2b', devAPIB2B()); // when testing calls made to intranet
        app.use('/api', devAPIB2B()); // when testing calls made to intranet
        // app.use('/api', b2bProxy()); //when testing calls made to b2b
        break;
    case 'api-chums':
        app.use('/api/user', intranetProxy());
        app.use('/api', devAPIChums());
        break;
    case 'api-operations':
        app.use('/api/operations', devAPIOperations());
        app.use('/api/user', intranetProxy());
        app.use('/api', intranetProxy())
        break;
    case 'api-partners':
        app.use('/api/partners', devAPIPartners());
        app.use('/api/user', intranetProxy());
        app.use('/api', intranetProxy())
        break;
    case 'api-payroll':
        app.use('/api/payroll', devAPIPayroll());
        app.use('/api/user', intranetProxy());
        app.use('/api', intranetProxy())
        break;
    case 'api-sage':
        app.use('/api/sage', devAPISage());
        app.use('/api/user', intranetProxy());
        app.use('/api', intranetProxy())
        break;
    case 'api-sales':
        app.use('/api/sales', devAPISales());
        app.use('/api/user', intranetProxy());
        app.use('/api', intranetProxy())
        break;
    case 'api-shopify':
        app.use('/api/shopify', devAPIShopify());
        app.use('/api/user', intranetProxy());
        app.use('/api', intranetProxy())
        break;
    case 'api-user':
        app.use('/api/user', devAPIUser());
        app.use('/api', intranetProxy())
        break;
    case 'api-images':
        app.use('/api/images', devAPIImages());
        app.use('/api/user', intranetProxy())
        app.use('/api', intranetProxy())
        break;
    default:
        debug(`Invalid site for proxy configuration()`);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res) => {
    res.status(404).send('local-proxy: Sorry, not found!');
})

const server = http.createServer(app);
server.listen(options.port, 'localhost');
debug(`listening on localhost: ${options.port}`);
