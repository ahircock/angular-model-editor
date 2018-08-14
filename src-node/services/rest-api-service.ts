import { ServiceManager } from '../service-manager';
import { HttpError } from '../utilities/http-error.class';
import { MongoDbService } from './mongo-db-service';
import { Request, Response } from 'express';

export class RestApiService {

    // here is the service that will do all db work
    private dbService: MongoDbService = ServiceManager.getService("db-service");
    
    /**
     * Express RequestHandler to handle GET requests
     */
    public async getAllHandler(entity: string, req: Request, res: Response) {

        try {
            let userid = ( req.headers.userid as string );
            let docs = await this.dbService.getAllDocuments( entity, userid );
            res.status(200).send(docs);
        } catch (err) {
            let httpError: HttpError = { errorCode: 100, errorMessage: err.toString() };
            res.status(500).send(httpError);
        }
        
    };

    /**
     * Express RequestHandler to handle GET:id requests
     */
    public async getByIdHandler(entity: string, req: Request, res: Response) {

        try {
            let getId = req.params.id;
            let userid = ( req.headers.userid as string );
            let docs = await this.dbService.getDocumentById( entity, getId, userid );
            res.status(200).send(docs);
        } catch (err) {
            let httpError: HttpError = { errorCode: 100, errorMessage: err.toString() };
            res.status(500).send(httpError);
        }
        
    };

    /**
     * Express RequestHandler to handle POST requests
     */
    public async createHandler(entity: string, req: Request, res: Response) {

        try {
            let passedDoc = req.body;
            let userid = ( req.headers.userid as string );
            let newDoc = await this.dbService.createDocument( entity, passedDoc, userid);
            res.status(200).send(newDoc);
        } catch (err) {
            let httpError: HttpError = { errorCode: 100, errorMessage: err.toString() };
            res.status(500).send(httpError);
        }
        
    };

    /**
     * Express RequestHandler to handle PUT requests
     */
    public async updateHandler(entity: string, req: Request, res: Response) {

        try {
            let passedDoc = req.body;
            let userid = ( req.headers.userid as string );
            let updatedDoc = await this.dbService.updateDocment(entity, passedDoc, userid);
            res.status(200).send(updatedDoc);
        } catch (err) {
            let httpError: HttpError = { errorCode: 100, errorMessage: err.toString() };
            res.status(500).send(httpError);
        }
        
    };

    /**
     * Express RequestHandler to handle DELETE requests
     */
    public async deleteHandler(entity: string, req: Request, res: Response) {

        try {
            let deleteId = req.params.id;
            let userid = ( req.headers.userid as string );
            let updatedDoc = await this.dbService.deleteDocument(entity, deleteId, userid);
            res.status(200).send(updatedDoc);
        } catch (err) {
            let httpError: HttpError = { errorCode: 100, errorMessage: err.toString() };
            res.status(500).send(httpError);
        }
        
    };
    
}



