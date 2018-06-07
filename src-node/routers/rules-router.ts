import { Router, Request, Response } from 'express';
import { ServiceManager } from '../service-manager';
import { RestApiService } from '../services/rest-api-service'

// create an express router
const router: Router = Router();

// get the service that deals with rest-api calls
const restApiService: RestApiService = ServiceManager.getService("rest-api-service");

// map the URLs to the handlers
router.get('/', (req: Request, res: Response ) => { restApiService.getAllHandler("rules", req, res); } );
router.get('/:id', (req: Request, res: Response ) => { restApiService.getByIdHandler("rules", req, res); } );
router.post('', (req: Request, res: Response ) => { restApiService.createHandler("rules", req, res); } );
router.put('/:id', (req: Request, res: Response ) => { restApiService.updateHandler("rules", req, res); } );
router.delete('/:id', (req: Request, res: Response ) => { restApiService.deleteHandler("rules", req, res); } );

// export the router
export default router;