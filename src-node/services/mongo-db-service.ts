import { MongoClient } from "mongodb";

export class MongoDbService {

  private MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/model-editor";
  private MONGO_DB = "model-editor";

  /**
   * This method is used to retrieve the list of all documents from one collection
   * in the database. It will return an array of documents
   * @param collection the collection that will be searched for documents
   */
  async getAllDocuments(collection: string): Promise<any[]> {
      
    // connect to the Mongo database
    let client = await MongoClient.connect(this.MONGO_URI);
    
    // find the query and return the results as an array
    let docs = await client.db(this.MONGO_DB).collection(collection).find().toArray();
    
    // close the database
    await client.close();
    
    // return the found array
    return docs;
  }

}


