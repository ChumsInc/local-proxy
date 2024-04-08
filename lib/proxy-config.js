import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({secure: false, changeOrigin: true});
proxy.on('error', (e) => {
    debug('onError()', e);
});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});


export const proxyAuth = (clientName, clientSecret) => {
    const proxy = httpProxy.createProxyServer({
        secure: false,
        changeOrigin: true,
        auth: `${clientName}:${clientSecret}`
    });
    proxy.on('proxyReq', (proxyReq, req, res, options) => {
        proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
    });
    return proxy;
}

