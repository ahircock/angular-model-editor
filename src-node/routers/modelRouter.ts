import * as modelService from '../services/modelService';
import { Router, Request, Response } from 'express';

// setup all of the URL handlers
const router = Router();
router.get('/', getAllModelsHandler);

async function getAllModelsHandler(req: Request, res: Response) {

    try {
        
        let modelList = await modelService.getAllModels();
        res.status(200).send(JSON.stringify(modelList));
        
    // if any error occurred, return a HTTP Status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};

export default router;