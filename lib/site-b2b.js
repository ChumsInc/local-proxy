import {Router} from 'express';
import {proxyAuth} from './proxy-config.js'
import Debug from 'debug';

const debug = Debug('chums:lib:site-b2b');

if (!process.env.INTRANET_API_CLIENT || !process.env.INTRANET_API_SECRET) {
    debug('init - required client/secret not defined');
    process.exit(0);
}

const b2bRouter = Router();
const proxy = proxyAuth(process.env.INTRANET_API_CLIENT, process.env.INTRANET_API_SECRET);

if (!process.env.INTRANET_API_CLIENT || !process.env.INTRANET_API_SECRET) {
    debug('init - required client/secret not defined');
    process.exit(0);
}

b2bRouter.use('/node-dev', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/node-dev/'});
});

b2bRouter.use('/node', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/node/'});
});

b2bRouter.use('/node_modules', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/node_modules/'});
});

b2bRouter.use('/node-sage', (req, res) => {
    proxy.web(req, res, {target: `https://b2b.chums.com/node-sage/`});
});

b2bRouter.use('/node-chums', (req, res) => {
    proxy.web(req, res, {target: `https://b2b.chums.com/node-chums/`});
});


b2bRouter.use('/sage', (req, res) => {
    proxy.web(req, res, {target: `https://b2b.chums.com/sage/`});
});

b2bRouter.use('/api', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/api/'});
});

b2bRouter.use('/images', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/images/'});
});

b2bRouter.use('/files', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/files/'});
});

b2bRouter.use('/pdf', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/pdf/'});
});

b2bRouter.use('/version', (req, res) => {
    proxy.web(req, res, {target: 'http://localhost:8080/package.json', ignorePath: true});
});

export default b2bRouter;
