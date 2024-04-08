import {Router} from 'express';
import {proxyAuth} from './proxy-config.js'
import Debug from 'debug';

const debug = Debug('chums:lib:site-intranet');

if (!process.env.INTRANET_API_CLIENT || !process.env.INTRANET_API_SECRET) {
    debug('init - required client/secret not defined');
    process.exit(0);
}

const intranetRouter = Router();
const proxy = proxyAuth(process.env.INTRANET_API_CLIENT, process.env.INTRANET_API_SECRET);

intranetRouter.use('/intranet', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/'});
});

intranetRouter.use('/images', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/images/'});
});

intranetRouter.use('/pm-images', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/pm-images/'});
});

intranetRouter.use('/api/user', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/api/user/'});
});

intranetRouter.use('/api', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/api/'});
});

intranetRouter.use('/node-dev', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/node-dev/'});
});

intranetRouter.use('/node', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/node/'});
});

intranetRouter.use('/node-api', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/node/'});
});

intranetRouter.use('/node_modules', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/node_modules/'});
});

intranetRouter.use('/node-sage', (req, res) => {
    proxy.web(req, res, {target: `https://intranet.chums.com/node-sage/`});
});

intranetRouter.use('/sage', (req, res) => {
    proxy.web(req, res, {target: `https://intranet.chums.com/sage/`});
});

intranetRouter.use('/arches', (req, res) => {
    proxy.web(req, res, {target: `https://intranet.chums.com/arches/`});
});

intranetRouter.use('/node-b2b', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/node-b2b/'});
});

intranetRouter.use('/timeclock', (req, res) => {
    proxy.web(req, res, {target: 'https://intranet.chums.com/timeclock/'});
});

export default intranetRouter;
