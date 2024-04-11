import {Router} from 'express';
import {proxyAuth} from './proxy-config.js'
import Debug from 'debug';

const debug = Debug('chums:lib:api-operations');

if (!process.env.INTRANET_API_CLIENT || !process.env.INTRANET_API_SECRET) {
    debug('init - required client/secret not defined');
    process.exit(0);
}


const proxy = proxyAuth(process.env.INTRANET_API_CLIENT, process.env.INTRANET_API_SECRET);

const apiOperationsRouter = Router();
apiOperationsRouter.use('/', (req, res) => {
    try {
        proxy.web(req, res, {target: `http://localhost:8088/`});
    } catch(err) {
        if (err instanceof Error) {
            debug("()", err.message);
            return res.json({error: err.message, name: err.name});
        }
        res.json({error: 'unknown error in '});
    }
})

export default apiOperationsRouter;
