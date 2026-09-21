import type {Request, Response} from "express";
import process from 'process'

interface DevToolsWorkspace {
    root: string,
    uuid: string,
}

function getWorkspace(site:string):DevToolsWorkspace|null {
    switch (site) {
        case 'dev:local':
            return {
                root: process.env.DEV_LOCAL_ROOT ?? '',
                uuid: process.env.DEV_LOCAL_UUID ?? '',
            }
        default:
            return null;
    }
}
export const getDevToolsWorkspace = (site:string) => async (req:Request, res:Response)=> {
    try {
        const workspace = getWorkspace(site);
        if (!workspace) {
            res.status(404).json({error: 'Workspace not found'});
        }
        res.json({workspace});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("()", err.message);
            return Promise.reject(err);
        }
        console.debug("()", err);
        return Promise.reject(new Error('Error in ()'));
    }
}

