import {Router} from 'express';
import {proxyAuth} from './proxy-config.js'
import Debug from 'debug';

const debug = Debug('chums:lib:api-shopify');

if (!process.env.INTRANET_API_CLIENT || !process.env.INTRANET_API_SECRET) {
    debug('init - required client/secret not defined');
    process.exit(0);
}


const proxy = proxyAuth(process.env.INTRANET_API_CLIENT, process.env.INTRANET_API_SECRET);

const apiShopifyRouter = Router();
apiShopifyRouter.use('/', (req, res) => {
    try {
        proxy.web(req, res, {target: `http://localhost:8086/`});
    } catch(err) {
        if (err instanceof Error) {
            debug("()", err.message);
            return res.json({error: err.message, name: err.name});
        }
        res.json({error: 'unknown error in '});
    }
})

export default apiShopifyRouter;
