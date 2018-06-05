import { ServiceManager } from '../service-manager';
import { MongoDbService } from './mongo-db-service';

export class RuleService {

    private mongoDBService: MongoDbService = ServiceManager.getService("mongo-service");
    
    private collection: string = 'rules';

    async getAllRules(): Promise<any[]> {
        return await this.mongoDBService.getAllDocuments(this.collection);
    }

    async createRule( newRule: any ): Promise<any> {
        return await this.mongoDBService.createDocument(this.collection, newRule );
    }

    async updateRule( updateRule: any ): Promise<any> {
        return await this.mongoDBService.updateDocment(this.collection, updateRule );
    }

    async deleteRule( deleteId: string ): Promise<void> {
        await this.mongoDBService.deleteDocument(this.collection, deleteId );
    }
}