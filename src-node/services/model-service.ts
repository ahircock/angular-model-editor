import { ServiceManager } from '../service-manager';
import { MongoDbService } from './mongo-db-service';

export class ModelService {

    private mongoDBService: MongoDbService;
    
    initService() {
        this.mongoDBService = ServiceManager.getService("MongoDbService");
    }

    private collection: string = 'models';

    async getAllModels(): Promise<any[]> {
        return await this.mongoDBService.getAllDocuments(this.collection);
    }
}