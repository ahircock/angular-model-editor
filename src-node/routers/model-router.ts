import { ServiceManager } from '../service-manager';
import { ModelService } from '../services/model-service';
import { Router, Request, Response } from 'express';

// Create a router object and export it
const router = Router();
export default router;

// map the URL to the handlers
router.get('/', getAllModelsHandler);

/**
 * Handler that returns all models
 */
async function getAllModelsHandler(req: Request, res: Response) {

    try {
        const modelService: ModelService = ServiceManager.getService("ModelService");
        let modelList = await modelService.getAllModels();
        res.status(200).send(modelList);
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};



