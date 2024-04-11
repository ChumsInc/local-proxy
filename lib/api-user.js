import {Router} from 'express';
import {proxyAuth} from './proxy-config.js'
import Debug from 'debug';

const debug = Debug('chums:lib:api-shopify');

if (!process.env.INTRANET_API_CLIENT || !process.env.INTRANET_API_SECRET) {
    debug('init - required client/secret not defined');
    process.exit(0);
}


const proxy = proxyAuth(process.env.INTRANET_API_CLIENT, process.env.INTRANET_API_SECRET);

const apiUserRouter = Router();
apiUserRouter.use('/', (req, res) => {
    try {
        proxy.web(req, res, {target: `http://localhost:8085/`});
    } catch(err) {
        if (err instanceof Error) {
            debug("()", err.message);
            return res.json({error: err.message, name: err.name});
        }
        res.json({error: 'unknown error in '});
    }
})

export default apiUserRouter;
