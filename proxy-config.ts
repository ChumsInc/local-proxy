import httpProxy, {ServerOptions, ErrorCallback, ProxyReqCallback} from "http-proxy";
import Debug from 'debug';
import http, {IncomingMessage, ServerResponse, ClientRequest} from 'node:http'
import {Socket} from 'node:net'


const debug = Debug('local-proxy:lib:proxy-config');


export const getAPIProxy = (clientName:string, clientSecret:string):httpProxy => {
    if (!clientName || !clientSecret) {
        debug('getAPIProxy() - invalid clientName or clientSecret');
    }
    const proxy = httpProxy.createProxyServer({
        secure: false,
        changeOrigin: true,
        auth: `${clientName}:${clientSecret}`
    });
    proxy.on('proxyReq', onProxyReq);
    proxy.on('error', onError)
    return proxy;
}

function onProxyReq(proxyReq:ClientRequest, req:IncomingMessage, res: ServerResponse, options:ServerOptions) {
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
}

function onError(err:Error, req:IncomingMessage, res:ServerResponse|Socket) {
    if (res instanceof ServerResponse) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        })
    } else {
        res.emit('data', {error: err.message});
    }
    res.end(`Something went wrong requesting: ${req.url}`);
}
