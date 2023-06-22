/**
 * Created by steve on 5/26/2016.
 */
/* global __dirname */
Error.stackTraceLimit = Infinity;
process.env.DEBUG = 'chums:*';

'use strict';

// console.log(process.argv);

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const compression = require('compression');
const debug = require('debug')('chums:index');
const routing = require('./lib/routing');
const httpProxy = require('http-proxy');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    {name: 'site', alias: 's', type: String},
    {name: 'port', type: Number},
];
const options = commandLineArgs(optionDefinitions);
console.log('options', options);

const INTRANET_API_CLIENT = process.env.INTRANET_API_CLIENT;
const INTRANET_API_SECRET = process.env.INTRANET_API_SECRET;



const proxy = httpProxy.createProxyServer({ secure: false, changeOrigin: true });
proxy.on('error', (e) => {
    debug('onError()', e);
});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

const proxyAuth = httpProxy.createProxyServer({
    secure: false,
    changeOrigin: true,
    auth: `${INTRANET_API_CLIENT}:${INTRANET_API_SECRET}`});

proxyAuth.on('proxyReq', (proxyReq, req, res, options) => {
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

const app = express();

app.locals.pretty = true;
app.set('json spaces', 2);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(compression());
// app.use('/css', express.static(__dirname + '/public/css', {fallthrough: false}));
// app.use('/js', express.static(__dirname + '/public/js', {fallthrough: false}));
app.use('/jquery', express.static(__dirname + '/public/jquery', {fallthrough: false}));
// app.use('/images', express.static(__dirname + '/public/images', {fallthrough: false}));
// app.use('/node_modules', express.static(__dirname + '/node_modules', {fallthrough: false}));
// app.use('/node/modules', express.static(__dirname + '/node_modules', {fallthrough: false}));

app.use((req, res, next) => {
    debug(req.method, req.url);
    next();
});

switch (options.site) {
case 'intranet':
    app.use('/intranet', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/' });
    });

    app.use('/www', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://www.chums.com/' });
    });

    app.use('/images', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/images/' });
    });

    app.use('/pm-images', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/pm-images/' });
    });

    app.use('/api/user', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/api/user/' });
    });

    app.use('/api', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/api/' });
    });

    app.use('/node-dev', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/node-dev/' });
    });

    app.use('/node', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/node/' });
    });

    app.use('/node-api', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/node/' });
    });

    app.use('/node_modules', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/node_modules/' });
    });

    app.use('/node-sage', (req, res) => {
        proxyAuth.web(req, res, { target: `https://intranet.chums.com/node-sage/` });
    });

    app.use('/sage', (req, res) => {
        proxyAuth.web(req, res, { target: `https://intranet.chums.com/sage/` });
    });

    app.use('/arches', (req, res) => {
        proxyAuth.web(req, res, { target: `https://intranet.chums.com/arches/` });
    });

    app.use('/bryce', (req, res) => {
        proxyAuth.web(req, res, { target: `https://intranet.chums.com/bryce/` });
    });

    app.use('/node-chums', (req, res) => {
        proxy.web(req, res, { target: 'https://www.chums.com/api/' });
    });

    app.use('/node-bc', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://www.beyondcoastal.com/api/' });
    });

    app.use('/node-safety', (req, res) => {
        proxy.web(req, res, { target: 'https://www.chumssafety.com/api/' });
    });

    app.use('/node-b2b', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/node-b2b/' });
    });

    app.use('/timeclock', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://intranet.chums.com/timeclock/' });
    });
    break;

case 'beyondcoastal':
    app.use('/images', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://www.beyondcoastal.com/images/' });
    });
    app.use('/css', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://www.beyondcoastal.com/css/' });
    });
    app.use('/api', (req, res) => {
        proxy.web(req, res, { target: 'https://www.beyondcoastal.com/api/' });
    });
    app.use('/catalog', (req, res) => {
        proxy.web(req, res, { target: 'https://www.beyondcoastal.com/catalog/' });
    });
    break;

case 'b2b':
    app.use('/node-dev', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://b2b.chums.com/node-dev/' });
    });

    app.use('/node', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://b2b.chums.com/node/' });
    });

    app.use('/node_modules', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://b2b.chums.com/node_modules/' });
    });

    app.use('/node-sage', (req, res) => {
        proxyAuth.web(req, res, { target: `https://b2b.chums.com/node-sage/` });
    });

    app.use('/node-chums', (req, res) => {
        proxyAuth.web(req, res, { target: `https://b2b.chums.com/node-chums/` });
    });


    app.use('/sage', (req, res) => {
        proxyAuth.web(req, res, { target: `https://b2b.chums.com/sage/` });
    });

    app.use('/api', (req, res) => {
        proxy.web(req, res, { target: 'https://b2b.chums.com/api/' });
    });

    app.use('/images', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://b2b.chums.com/images/' });
    });

    app.use('/files', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://b2b.chums.com/files/' });
    });

    app.use('/pdf', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://b2b.chums.com/pdf/' });
    });

    app.use('/version', (req, res) => {
        proxyAuth.web(req, res, { target: 'https://b2b.chums.com/version' });
    });

    break;

    case 'pgw':
        app.use('/api', (req, res) => {
            proxyAuth.web(res, res, {target: 'https://petroglyphwatch.com/api'});
        });

        app.use('/images', (req, res) => {
            proxyAuth.web(res, res, {target: 'https://petroglyphwatch.com/images'});
        });

}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(routing.router);

const server = http.createServer(app);
server.listen(options.port || 8081, 'localhost');
debug('listening on localhost:' + options.port || 8081);
