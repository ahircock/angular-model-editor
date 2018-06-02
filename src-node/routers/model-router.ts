import * as modelService from '../services/model-service';
import { Router, Request, Response } from 'express';

// This module will create a router that is exported
const router = Router();
export default router;

// map the URL to the handlers
router.get('/', getAllModelsHandler);

/**
 * Handler that returns all models
 */
async function getAllModelsHandler(req: Request, res: Response) {

    try {
        let modelList = await modelService.getAllModels();
        res.status(200).send(JSON.stringify(modelList));
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};

