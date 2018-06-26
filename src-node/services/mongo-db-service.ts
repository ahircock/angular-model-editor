import { MongoClient, Db } from "mongodb";

/**
 * This class is meant to provide an API for doing REST-ful services on 
 * a Mongo Database. REST-ful services are GET, UPDATE, CREATE, DELETE
 */
export class MongoDbService {

  private MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
  private MONGO_DB = "model-editor";
  private mongoDb: Db;

  /**
   * Connect to the mongo database, and store the connection in this.mongoDb
   */
  async connect(): Promise<void> {

    // if we aren't connected yet, then connect
    if ( !this.mongoDb ) {
      let mongoConnection = await MongoClient.connect(this.MONGO_URI);
      this.mongoDb = mongoConnection.db(this.MONGO_DB);
    }

  }

  /**
   * Retrieve the list of all documents for one type of entity in the database.
   * @param entity the type of document being returned
   * @returns array of documents of the given entity type
   */
  async getAllDocuments(entity: string, userId?: string): Promise<any[]> {
    await this.connect();
    let filter = {};
    if ( userId ) {
      filter = { userId:{ $in: ["GLOBAL", "global", userId] } };
    }
    return await this.mongoDb.collection(entity).find(filter).toArray();
  }

  /**
   * Search for a single entity document in the databadse, using
   * the document's ID. It will return a the matching document if found, or NULL if 
   * the id does not exist
   * @param entity the type of document being returned
   * @param getId the id of the document 
   * @returns a single document that matches the given getId
   */
  async getDocumentById(entity: string, getId: string, userId?: string): Promise<any> {
    await this.connect();
    let filter: any = { _id: getId };
    if ( userId ) { 
      filter = { _id:getId, userId: { $in: ["GLOBAL", "global", userId] } };
    }
    return await this.mongoDb.collection(entity).findOne(filter);
  }

  /**
   * Update a single entity document in the database. This will use the 
   * REPLACE technique and the existing document will be completely replaced 
   * by the provided document
   * @param entity the type of document being updated
   * @param updateDoc the document that will be updated in the database
   * @returns a copy of the document after the update
   */
  async updateDocment(entity: string, updateDoc: any, userId?: string): Promise<any> {
    await this.connect();
    let filter: any = { _id: updateDoc._id };
    if ( userId ) { 
      filter = { _id:updateDoc._id, userId: userId };
      updateDoc.userId = userId;
    }
    let result = await this.mongoDb.collection(entity).findOneAndReplace( filter, updateDoc, {returnOriginal: false} );
    if ( result.value ) {
      return result.value;
    } else {
      throw new Error("no document found with a matching _id")
    }
  }

  /**
   * Create a new entity document in the database.
   * @param entity the type of document being created
   * @param newDoc the new document that will be inserted in the database
   * @returns a copy of the new document. The _id of the document will be the new identifier
   */
  async createDocument(entity: string, newDoc: any, userId?: string): Promise<any> {
    await this.connect();
    if ( userId ) { newDoc.userId = userId; }
    let result = await this.mongoDb.collection(entity).insertOne(newDoc);
    newDoc._id = result.insertedId;
    return newDoc;
  }

  /**
   * Delete an existing entity document from the database. There is no return
   * value
   * @param entity the type of document being deleted
   * @param deleteId the id of the document to be deleted
   */
  async deleteDocument(entity: string, deleteId: string, userId?: string): Promise<void> {
    await this.connect();
    let filter: any = { _id: deleteId };
    if ( userId ) { 
      filter = { _id:deleteId, userId: userId };
    }
    let result = await this.mongoDb.collection(entity).deleteOne(filter);
    if ( result.deletedCount == 0 ) {
      throw new Error("no document found with a matching _id")
    }
  }

  /**
   * Generate a new unique ID for a record in the database
   * @returns returns a string representation of the new ID
   */
  async getNextId(): Promise<string> {
    await this.connect();
    
    // get the next ID from the sequence
    let sequenceDoc = await this.mongoDb.collection("config").findOneAndUpdate( {_id:"idSequence"}, {$inc:{sequenceValue:1}} );
    return sequenceDoc.value.sequenceValue.toString();
  }

}


