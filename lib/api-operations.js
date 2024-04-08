import {Router} from 'express';
import {proxyAuth} from './proxy-config.js'
import Debug from 'debug';

const debug = Debug('chums:lib:api-operations');

if (!process.env.INTRANET_API_CLIENT || !process.env.INTRANET_API_SECRET) {
    debug('init - required client/secret not defined');
    process.exit(0);
}

const apiOperationsRouter = Router();
const proxy = proxyAuth(process.env.INTRANET_API_CLIENT, process.env.INTRANET_API_SECRET);

apiOperationsRouter.use('/', (req, res) => {
    proxy.web(req, res, {target: `http://localhost:8088/`});
})

export default apiOperationsRouter;
