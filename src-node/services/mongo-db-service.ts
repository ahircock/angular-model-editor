import { MongoClient, Db } from "mongodb";

export class MongoDbService {

  private MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
  private MONGO_DB = "model-editor";
  private mongoDb: Db;

  /**
   * Connect to the mongo database, and store the result in this.mongoConnection
   */
  async connect(): Promise<void> {

    // if we aren't connected yet, then connect
    if ( !this.mongoDb ) {
      let mongoConnection = await MongoClient.connect(this.MONGO_URI);
      this.mongoDb = mongoConnection.db(this.MONGO_DB);
    }

  }

  /**
   * This method is used to retrieve the list of all documents from one collection
   * in the database. It will return an array of documents
   * @param collection the collection that will be searched for documents
   */
  async getAllDocuments(collection: string): Promise<any[]> {
    await this.connect();
    return await this.mongoDb.collection(collection).find().toArray();
  }

  async getDocumentById(collection: string, getId: string): Promise<any> {
    await this.connect();
    return await this.mongoDb.collection(collection).findOne({_id:getId});
  }

  async updateDocment( collection: string, updateDoc: any ): Promise<any> {
    await this.connect();
    await this.mongoDb.collection(collection).findOneAndReplace( {_id: updateDoc._id}, updateDoc );
    return updateDoc;
  }

  async createDocument( collection: string, newDoc: any ): Promise<any> {
    await this.connect();
    let result = await this.mongoDb.collection(collection).insertOne(newDoc);
    newDoc._id = result.insertedId;
    return newDoc;
  }

  async deleteDocument( collection: string, deleteId: string ): Promise<void> {
    await this.connect();
    await this.mongoDb.collection(collection).deleteOne({_id: deleteId});
  }

}


