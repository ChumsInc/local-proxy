import HttpProxyRules from 'http-proxy-rules';
import {proxyAuth} from "./proxy-config.js";

const proxy = proxyAuth(process.env.INTRANET_API_CLIENT, process.env.INTRANET_API_SECRET);

export const proxySettings = {
    intranet: {
        listen: 8081,
        proxy,
        rules: new HttpProxyRules({
            rules: {
                '/intranet': 'https://intranet.chums.com',
                '/images': 'https://intranet.chums.com/images/',
                '/pm-images': 'https://intranet.chums.com/pm-images/',
                '/api': 'https://intranet.chums.com/api/',
                '/node_modules': 'https://intranet.chums.com/node_modules/',
                '/node-sage': 'https://intranet.chums.com/node-sage/',
                '/sage': 'https://intranet.chums.com/sage/',
                '/arches': 'https://intranet.chums.com/arches/',
                '/node-b2b': 'https://intranet.chums.com/node-b2b/',
                '/timeclock': 'https://intranet.chums.com/timeclock/',
            },
        })
    },
    b2b: {
        listen: 8081,
        proxy,
        rules: new HttpProxyRules({
            rules: {
                '/api': 'https://b2b.chums.com/api',
                '/node_modules': 'https://b2b.chums.com/node_modules',
                '/node-sage': 'https://b2b.chums.com/node-sage/',
                '/sage': 'https://b2b.chums.com/sage/',
                '/images': 'https://b2b.chums.com/images/',
                '/file': 'https://b2b.chums.com/files/',
                '/pdf': 'https://b2b.chums.com/pdf/',
                '/version': 'http://localhost:8080/package.json',
            },
        }),
        ignorePath: (target) => {
            return target === '/version';
        }
    },
    'api-operations': {
        listen: 80,
        proxy,
        rules: new HttpProxyRules({
            rules: {
                '/api/user': 'https://intranet.chums.com/api/user',
                '/api/shopify': 'https://intranet.chums.com/api/shopify',
                '/node-sage': 'https://intranet.chums.com/node-sage',
                '/sage': 'https://intranet.chums.com/sage',
                '/api/search': 'https://intranet.chums.com/api/search',
            }
        })
    },
    'api-partners': {
        listen: 80,
        proxy,
        rules: new HttpProxyRules({
            rules: {
                '/api/user': 'https://intranet.chums.com/api/user',
            }
        })
    },
    'api-sales': {
        listen: 80,
        proxy,
        rules: new HttpProxyRules({
            rules: {
                '/api/images': 'https://intranet.chums.com/',
                '/api/user': 'https://intranet.chums.com/api/user',
            }
        })
    },
    'api-shopify': {
        listen: 80,
        proxy,
        rules: new HttpProxyRules({
            rules: {
                '/api/user': 'https://intranet.chums.com/api/user',
            }
        })
    },
    'api-timeclock': {
        listen: 80,
        proxy,
        rules: new HttpProxyRules({
            rules: {
                '/api/user': 'https://intranet.chums.com/api/user/'
            },
        })
    },
    'b2b-server': {
        listen: 80,
        proxy,
        rules: new HttpProxyRules({
            rules: {
                '/keywords': 'https://b2b.chums.com/api/keywords',
                '/preload': 'https://b2b.chums.com/api/preload',
                '/images': 'https://b2b.chums.com/images',
                '/version': 'http://localhost:8080/package.json',
            }
        }),
        ignorePath: (target) => {
            return target === '/version';
        }
    }
}
