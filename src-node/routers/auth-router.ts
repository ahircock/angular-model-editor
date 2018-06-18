import { Router, Request, Response, NextFunction } from 'express';
import { ServiceManager } from '../service-manager';
import { AuthService } from '../services/auth-service';

// create an express router
const router: Router = Router();

// get the service that deals with authorization calls
const authService: AuthService = ServiceManager.getService("auth-service");

// map the urls to the handlers
router.post('/login', async (req: Request, res: Response ) => { authService.loginHandler(req, res); } );
router.post('/signup', async (req: Request, res: Response ) => { authService.signupHandler(req, res); } );

// validate every other call to make sure that it is authenticated
router.use('/', async (req: Request, res: Response, next: NextFunction ) => { authService.checkIfAuthenticated(req, res, next); } );

// export the router
export default router;