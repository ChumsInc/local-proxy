import httpProxy from "http-proxy";
import Debug from 'debug';

const debug = Debug('local-proxy:lib:proxy-config');

const proxy = httpProxy.createProxyServer({secure: false, changeOrigin: true});
proxy.on('error', (e) => {
    debug('onError()', e);
});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});


export const proxyAuth = (clientName, clientSecret) => {
    if (!clientName || !clientSecret) {
        debug('proxyAuth() - invalid clientName or clientSecret');
    }
    const proxy = httpProxy.createProxyServer({
        secure: false,
        changeOrigin: true,
        auth: `${clientName}:${clientSecret}`
    });
    proxy.on('proxyReq', (proxyReq, req, res, options) => {
        proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
    });
    proxy.on('error', (err, req, res) => {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        })
        res.end(`Something went wrong requesting: ${req.url}`);
    })
    return proxy;
}

