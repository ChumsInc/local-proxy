import type {NextFunction, Request, Response} from "express";
import process from 'process'
import debug from 'debug'

const logger = debug('local-proxy:workspaces');

const workSpaces: Record<string, DevToolsWorkspace> = {
    'dev:local': {
        root: process.env.DEV_LOCAL_ROOT ?? '',
        uuid: process.env.DEV_LOCAL_UUID ?? '',
    }
}

interface DevToolsWorkspace {
    root: string,
    uuid: string,
}

function getWorkspace(site: string): DevToolsWorkspace | null {
    switch (site) {
        case 'dev:local':
            return workSpaces[site];
        default:
            return null;
    }
}

export const getDevToolsWorkspace = (site: string) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspace = getWorkspace(site);
        if (!workSpaces[site]) {
            next();
            return;
        }
        if (!workspace) {
            logger('getDevToolsWorkspace()', 'Workspace not found, make sure your environment variables are set correctly');
            res.status(404).json({error: 'Workspace not found'});
            return;
        }
        res.json({workspace});
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger("getDevToolsWorkspace()", err.message);
            return Promise.reject(err);
        }
        logger("getDevToolsWorkspace()", err);
        return Promise.reject(new Error('Error in ()'));
    }
}


export const handleUnknownWellKnownRoute = (req: Request, res: Response) => {
    logger('handleUnknownWellKnownRoute()', "Unknown route requested", req.originalUrl);
    res.status(404).json({error: 'Route not found'});
}
