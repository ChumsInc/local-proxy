import {Router} from 'express';
import {proxyAuth} from './proxy-config.js'
import Debug from 'debug';

const debug = Debug('chums:lib:api-shopify');

if (!process.env.INTRANET_API_CLIENT || !process.env.INTRANET_API_SECRET) {
    debug('init - required client/secret not defined');
    process.exit(0);
}


const proxy = proxyAuth(process.env.INTRANET_API_CLIENT, process.env.INTRANET_API_SECRET);

const apiPartnersRouter = Router();
apiPartnersRouter.use('/', (req, res) => {
    proxy.web(req, res, {target: `http://localhost:8089/`});
})

export default apiPartnersRouter;
