import { MongoClient } from "mongodb";

export class MongoDbService {

  private MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
  private MONGO_DB = "model-editor";
  private mongoConnection: MongoClient;

  /**
   * This method is used to retrieve the list of all documents from one collection
   * in the database. It will return an array of documents
   * @param collection the collection that will be searched for documents
   */
  async getAllDocuments(collection: string): Promise<any[]> {

    // if we aren't connected yet, then connect
    if ( !this.mongoConnection ) {
      this.mongoConnection = await MongoClient.connect(this.MONGO_URI);
    }
      
    // find the query and return the results as an array
    return await this.mongoConnection.db(this.MONGO_DB).collection(collection).find().toArray();
  }

}


