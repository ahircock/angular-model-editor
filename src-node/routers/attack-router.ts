import { Router, Request, Response } from 'express';
import { ServiceManager } from '../service-manager';
import { RestApiService } from '../services/rest-api-service';

// create an express router
const router: Router = Router();

// get the service that deals with rest-api calls
const restApiService: RestApiService = ServiceManager.getService('rest-api-service');

// map the URLs to the handlers
router.get('/', (req: Request, res: Response ) => { restApiService.getAllHandler('attacks', req, res); } );
router.get('/:id', (req: Request, res: Response ) => { restApiService.getByIdHandler('attacks', req, res); } );
router.post('', (req: Request, res: Response ) => { restApiService.createHandler('attacks', req, res); } );
router.put('/:id', (req: Request, res: Response ) => { restApiService.updateHandler('attacks', req, res); } );
router.delete('/:id', (req: Request, res: Response ) => { restApiService.deleteHandler('attacks', req, res); } );

// export the router
export default router;
