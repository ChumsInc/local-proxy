import proxy, {ProxyOptions} from 'express-http-proxy';
import process from 'node:process'
import {Request} from 'express';

const apiClient = process.env.INTRANET_API_CLIENT ?? 'missing';
const apiSecret = process.env.INTRANET_API_SECRET ?? 'unknown';

const getIntranetAuth = () => {
    if (!apiClient || !apiSecret || apiClient === 'missing' || apiSecret == 'unknown') {
        console.warn('\n\n\n*** Mising environment values. Please check for a valid .env file. ***\n\n\n');
        process.exit(1);
    }
    return `${apiClient}:${apiSecret}`;
}

const intranetProxyOptions: ProxyOptions = {
    proxyReqPathResolver: (req: Request) => {
        return req.originalUrl
    },
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    }),
    limit: '10mb'
}


export const intranetProxy = () => proxy('https://intranet.chums.com', {...intranetProxyOptions});
export const b2bProxy = () => proxy('https://b2b.chums.com', {...intranetProxyOptions});
export const devB2BVersion = () => proxy('http://localhost:8080/package.json', {proxyReqPathResolver: () => '/package.json'});

export const devAPIB2B = () => proxy('http://localhost:8081', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
})

export const devAPIChums = () => proxy('http://localhost:8001', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
});

export const devAPIImages = () => proxy('http://localhost:8002', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
})

export const devAPIOperations = () => proxy('http://localhost:8088', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
})

export const devAPIPartners = () => proxy('http://localhost:8089', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
})

export const devAPIPayroll = () => proxy('http://localhost:8003', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
})

export const devAPISage = () => proxy('http://localhost:8010', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
})

export const devAPISales = () => proxy('http://localhost:8087', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
})

export const devAPIShopify = () => proxy('http://localhost:8086', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
})

export const devAPIUser = () => proxy('http://localhost:8085', {
    proxyReqOptDecorator: (proxyReqOpts) => ({
        ...proxyReqOpts,
        auth: getIntranetAuth()
    })
})

export const getListenPort = (site: string) => {
    switch (site) {
        case 'intranet':
        case 'b2b':
            return 8081;
        case 'b2b-api':
        case 'api-b2b':
        case 'api-chums':
        case 'api-operations':
        case 'api-partners':
        case 'api-sales':
        case 'api-shopify':
        case 'api-timeclock':
        default:
            return 80;
    }
}
