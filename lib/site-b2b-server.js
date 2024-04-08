import {Router} from 'express';
import {proxyAuth} from './proxy-config.js'
import Debug from 'debug';

const debug = Debug('chums:lib:site-b2b-server');

if (!process.env.INTRANET_API_CLIENT || !process.env.INTRANET_API_SECRET) {
    debug('init - required client/secret not defined');
    process.exit(0);
}

const b2bServerRouter = Router();
const proxy = proxyAuth(process.env.INTRANET_API_CLIENT, process.env.INTRANET_API_SECRET);

b2bServerRouter.use('/keywords', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/api/keywords'});
})
b2bServerRouter.use('/preload', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/api/preload'});
})
b2bServerRouter.use('/images', (req, res) => {
    proxy.web(req, res, {target: 'https://b2b.chums.com/images/'});
});
b2bServerRouter.use('/version', (req, res) => {
    proxy.web(req, res, {target: 'http://localhost:8080/package.json', ignorePath: true});
});

export default b2bServerRouter;
