import httpProxy from "http-proxy";
import Debug from 'debug';
import { ServerResponse } from 'node:http';
const debug = Debug('local-proxy:lib:proxy-config');
export const getAPIProxy = (clientName, clientSecret) => {
    if (!clientName || !clientSecret) {
        debug('getAPIProxy() - invalid clientName or clientSecret');
    }
    const proxy = httpProxy.createProxyServer({
        secure: false,
        changeOrigin: true,
        auth: `${clientName}:${clientSecret}`
    });
    proxy.on('proxyReq', onProxyReq);
    proxy.on('error', onError);
    return proxy;
};
function onProxyReq(proxyReq, req, res, options) {
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
}
function onError(err, req, res) {
    if (res instanceof ServerResponse) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
    }
    else {
        res.emit('data', { error: err.message });
    }
    res.end(`Something went wrong requesting: ${req.url}`);
}
