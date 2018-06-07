import { ServiceManager } from '../service-manager';
import { MongoDbService } from '../services/mongo-db-service';
import { Request, Response } from 'express';

export class RestApiService {

    // here is the service that will do all db work
    private dbService: MongoDbService = ServiceManager.getService("db-service");
    
    /**
     * Express RequestHandler to handle GET requests
     */
    public async getAllHandler(entity: string, req: Request, res: Response) {

        try {
            let docs = await this.dbService.getAllDocuments( entity );
            res.status(200).send(docs);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };

    /**
     * Express RequestHandler to handle GET:id requests
     */
    public async getByIdHandler(entity: string, req: Request, res: Response) {

        try {
            let getId = req.params.id;
            let docs = await this.dbService.getDocumentById( entity, getId );
            res.status(200).send(docs);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };

    /**
     * Express RequestHandler to handle POST requests
     */
    public async createHandler(entity: string, req: Request, res: Response) {

        try {
            let passedDoc = req.body;
            let newDoc = await this.dbService.createDocument( entity, passedDoc);
            res.status(200).send(newDoc);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };

    /**
     * Express RequestHandler to handle PUT requests
     */
    public async updateHandler(entity: string, req: Request, res: Response) {

        try {
            let passedDoc = req.body;
            let updatedDoc = await this.dbService.updateDocment(entity, passedDoc);
            res.status(200).send(updatedDoc);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };

    /**
     * Express RequestHandler to handle DELETE requests
     */
    public async deleteHandler(entity: string, req: Request, res: Response) {

        try {
            let deleteId = req.params.id;
            let updatedDoc = await this.dbService.deleteDocument(entity, deleteId);
            res.status(200).send(updatedDoc);
        } catch (err) {
            res.status(500).send(err.toString()); 
        }
        
    };
    
}



