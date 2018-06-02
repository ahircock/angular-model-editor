import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/model-editor";
const MONGO_DB = "model-editor";
const MONGO_COLLECTION = "models";

/**
 * This method is used to retrieve the list of all models in the database. It will return an array 
 * of model objects
 */
export async function getAllModels() {
    
    // connect to the Mongo database
    let client = await MongoClient.connect(MONGO_URI);
    
    // find the query and return the results as an array
    let docs = await client.db(MONGO_DB).collection(MONGO_COLLECTION).find().toArray();
    
    // close the database
    await client.close();
    
    // return the found array
    return docs;
}
