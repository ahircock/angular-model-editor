import { ServiceManager } from '../service-manager';
import { MongoDbService } from '../services/mongo-db-service';
import { Router, Request, Response } from 'express';

export default class RestApiRouter {

    // Create a router object and export it
    private expressRouter: Router = Router();

    // here is the service that will do all db work
    private dbService: MongoDbService = ServiceManager.getService("db-service");
    
    /**
     * Creates an Express Router that will translate all of the normal rest endpoints:
     * GET, GET:id, POST, PUT:id, DELETE:id into database CRUD requests. You must specify 
     * the database collection associated to this endpoint, ie. where the information 
     * will be stored
     * @param collectionName name of the db collection being modified
     */
    constructor( private collectionName: string ) {

        // map the URLs to the handlers
        this.expressRouter.get('/', this.getAllHandler);
        this.expressRouter.get('/:id', this.getByIdHandler);
        this.expressRouter.post('', this.createHandler);
        this.expressRouter.put('/:id', this.updateHandler);
        this.expressRouter.delete('/:id', this.deleteHandler);
    }

    /**
     * Returns the Express framework router that was prepared by 
     * this class
     */
    public getExpressRouter(): Router {
        return this.expressRouter;
    }

    /**
     * Express RequestHandler to handle GET requests
     */
    private async getAllHandler(req: Request, res: Response) {

        try {
            let docs = await this.dbService.getAllDocuments( this.collectionName );
            res.status(200).send(docs);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };

    /**
     * Express RequestHandler to handle GET:id requests
     */
    private async getByIdHandler(req: Request, res: Response) {

        try {
            let getId = req.params.id;
            let docs = await this.dbService.getDocumentById( this.collectionName, getId );
            res.status(200).send(docs);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };

    /**
     * Express RequestHandler to handle POST requests
     */
    private async createHandler(req: Request, res: Response) {

        try {
            let passedDoc = req.body;
            let newDoc = await this.dbService.createDocument( this.collectionName, passedDoc);
            res.status(200).send(newDoc);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };

    /**
     * Express RequestHandler to handle PUT requests
     */
    private async updateHandler(req: Request, res: Response) {

        try {
            let passedDoc = req.body;
            let updatedDoc = await this.dbService.updateDocment(this.collectionName, passedDoc);
            res.status(200).send(updatedDoc);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };

    /**
     * Express RequestHandler to handle DELETE requests
     */
    private async deleteHandler(req: Request, res: Response) {

        try {
            let deleteId = req.params.id;
            let updatedDoc = await this.dbService.deleteDocument(this.collectionName, deleteId);
            res.status(200).send(updatedDoc);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };
    
}



