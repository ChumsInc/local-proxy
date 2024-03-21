import "dotenv/config.js";
import express from 'express';
import bodyParser from "body-parser";
import compression from 'compression';
import * as http from "node:http";
import Debug from 'debug';
import httpProxy from 'http-proxy';
import commandLineArgs from "command-line-args";

const debug = Debug('local-proxy:index');

const optionDefinitions = [
    {name: 'site', alias: 's', type: String},
    {name: 'port', type: Number},
];
const options = commandLineArgs(optionDefinitions);
console.log('options', options);

let clientName = null;
let clientSecret = null;
switch (options.site) {
case 'intranet':
case 'b2b':
case 'b2b-server':
    clientName = process.env.INTRANET_API_CLIENT;
    clientSecret = process.env.INTRANET_API_SECRET;
    break;
}

if (!clientName || !clientSecret) {
    console.log('Invalid Credentials');
    process.exit();
}

if (!options.port) {
    options.port = 8081;
}

const proxy = httpProxy.createProxyServer({secure: false, changeOrigin: true});
proxy.on('error', (e) => {
    debug('onError()', e);
});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

const proxyAuth = httpProxy.createProxyServer({
    secure: false,
    changeOrigin: true,
    auth: `${clientName}:${clientSecret}`
});

proxyAuth.on('proxyReq', (proxyReq, req, res, options) => {
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

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
    app.use('/intranet', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/'});
    });

    app.use('/images', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/images/'});
    });

    app.use('/pm-images', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/pm-images/'});
    });

    app.use('/api/user', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/api/user/'});
    });

    app.use('/api', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/api/'});
    });

    app.use('/node-dev', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/node-dev/'});
    });

    app.use('/node', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/node/'});
    });

    app.use('/node-api', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/node/'});
    });

    app.use('/node_modules', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/node_modules/'});
    });

    app.use('/node-sage', (req, res) => {
        proxyAuth.web(req, res, {target: `https://intranet.chums.com/node-sage/`});
    });

    app.use('/sage', (req, res) => {
        proxyAuth.web(req, res, {target: `https://intranet.chums.com/sage/`});
    });

    app.use('/arches', (req, res) => {
        proxyAuth.web(req, res, {target: `https://intranet.chums.com/arches/`});
    });

    app.use('/bryce', (req, res) => {
        proxyAuth.web(req, res, {target: `https://intranet.chums.com/bryce/`});
    });

    app.use('/node-chums', (req, res) => {
        proxy.web(req, res, {target: 'https://www.chums.com/api/'});
    });

    app.use('/node-bc', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://www.beyondcoastal.com/api/'});
    });

    app.use('/node-safety', (req, res) => {
        proxy.web(req, res, {target: 'https://www.chumssafety.com/api/'});
    });

    app.use('/node-b2b', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/node-b2b/'});
    });

    app.use('/timeclock', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://intranet.chums.com/timeclock/'});
    });
    break;

case 'b2b':
    app.use('/node-dev', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://b2b.chums.com/node-dev/'});
    });

    app.use('/node', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://b2b.chums.com/node/'});
    });

    app.use('/node_modules', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://b2b.chums.com/node_modules/'});
    });

    app.use('/node-sage', (req, res) => {
        proxyAuth.web(req, res, {target: `https://b2b.chums.com/node-sage/`});
    });

    app.use('/node-chums', (req, res) => {
        proxyAuth.web(req, res, {target: `https://b2b.chums.com/node-chums/`});
    });


    app.use('/sage', (req, res) => {
        proxyAuth.web(req, res, {target: `https://b2b.chums.com/sage/`});
    });

    app.use('/api', (req, res) => {
        proxy.web(req, res, {target: 'https://b2b.chums.com/api/'});
    });

    app.use('/images', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://b2b.chums.com/images/'});
    });

    app.use('/files', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://b2b.chums.com/files/'});
    });

    app.use('/pdf', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://b2b.chums.com/pdf/'});
    });

    app.use('/version', (req, res) => {
        proxyAuth.web(req, res, {target: 'http://localhost:8080/package.json', ignorePath: true});
    });

    break;

case 'b2b-server':
    app.use('/keywords', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://b2b.chums.com/api/keywords'});
    })
    app.use('/preload', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://b2b.chums.com/api/preload'});
    })
    app.use('/images', (req, res) => {
        proxyAuth.web(req, res, {target: 'https://b2b.chums.com/images/'});
    });
    app.use('/version', (req, res) => {
        proxyAuth.web(req, res, {target: 'http://localhost:8080/package.json', ignorePath: true});
    });
    break;

}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = http.createServer(app);
server.listen(options.port ?? 8081, 'localhost');
debug('listening on localhost:' + options.port || 8081);
