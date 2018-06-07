import { Router, Request, Response } from 'express';
import { ServiceManager } from '../service-manager';
import { MongoDbService } from '../services/mongo-db-service';

// create an express router
const router: Router = Router();

// GET /getnextid will return the next ID from the database
router.get('/getnextid', async (req: Request, res: Response ) => { 
  try {
    let dbService: MongoDbService = ServiceManager.getService("db-service");
    let id = await dbService.getNextId();
    res.status(200).send(id);
} catch (err) {
    res.status(500).send(err.toString()); 
}
} );

// export the router
export default router;