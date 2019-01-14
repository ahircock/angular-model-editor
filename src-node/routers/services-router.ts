import { Router, Request, Response } from 'express';
import { ServiceManager } from '../service-manager';
import { HttpError } from '../utilities/http-error.class';
import { MongoDbService } from '../services/mongo-db-service';

// create an express router
const router: Router = Router();

// GET /getnextid will return the next ID from the database
router.get('/getnextid', async (req: Request, res: Response ) => {
  try {
    const dbService: MongoDbService = ServiceManager.getService('db-service');
    const id = await dbService.getNextId();
    res.status(200).send(id);
} catch (err) {
    const httpError: HttpError = { errorCode: 100, errorMessage: err.toString() };
    res.status(500).send(httpError);
}
} );

// export the router
export default router;
