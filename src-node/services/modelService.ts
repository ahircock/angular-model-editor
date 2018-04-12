import * as mongoDb from "mongodb";

const mongoDBUri = "mongodb://admin:blix2400@ds237669.mlab.com:37669/model-editor";

/**
 * This method is used to find the list of models that match the searchString criteria
 *
 * @param searchString {string} This is the search string that will be used to text match on the model entries
 * @return {array of ModelEntry}
 */
export async function getModelSearch ( searchString : string ) {
    
    // if a searchString is provided, then perform a mongo TEXT search
    let query = {};
    if ( searchString.length > 0 ) {
        query = { $text: { $search: searchString } };            
    }
    let returnFields = { name:1, cost:1 };
    let sortFields = { name: 1 };
    
    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);
    
    // find the query and return the results as an array
    let docs = await client.db("model-editor").collection("models").find(query).project(returnFields).sort(sortFields).toArray();
    
    // close the database
    client.close();
    
    // return the found array
    return docs;
}

/**
 * This method is used to find the list of models that match the searchString criteria
 *
 * @param searchString This is the search string that will be used to text match on the model entries. It will match on the model name
 * @param provideRuleText Do you want the returned model to include the full rule text (name, description, etc.). If "false", then only return the specialRuleId
 * @return Returns the matching model object 
 */
export async function getModelById ( modelId: string, provideRuleText: boolean ) {
    
    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);
    
    // if a searchString is provided, then perform a mongo TEXT search
    let query = { _id: modelId };
    
    // find the query and return the results as an array
    let modelCursor = client.db("model-editor").collection("models").find( query );
    let model: any;
    if ( await modelCursor.hasNext() ) {
        model = await modelCursor.next();
    } else {
        client.close();
        throw new Error( "Invalid id " + modelId );
    }
    
    // if you want rule text
    if ( provideRuleText ) {

        // loop through and load the special rule details into the model
        for ( let i=0; i<model.specialRules.length; i++ ) {
            let ruleQuery = { _id: model.specialRules[i] }
            let ruleCursor = await client.db("model-editor").collection("specialRules").find( ruleQuery );
            if ( await ruleCursor.hasNext() ) {
                model.specialRules[i] = await ruleCursor.next();
            } else {
                client.close();
                throw new Error( "Invalid id in models.specialRules " + model.specialRules[i]._id );
            }
        }

        // loop through and load the special rule details for each action on the model
        for ( let i=0; i<model.actions.length; i++ ) {
            for ( let j=0; j<model.actions[i].specialRules.length; j++ ) {
                let ruleQuery = { _id: model.actions[i].specialRules[j] }
                let ruleCursor = await client.db("model-editor").collection("specialRules").find( ruleQuery );
                if ( await ruleCursor.hasNext() ) {
                    model.actions[i].specialRules[j] = await ruleCursor.next();
                } else {
                    client.close();
                    throw new Error( "Invalid id in models.actions.specialRules " + model.actions[i].specialRules[j]._id );
                }

            }
        }
    }
    
    // close the database
    client.close();
    
    // return the found array
    return model;
}

/**
 * This method is used to find the list of models that match the searchString criteria
 *
 * @param searchString This is the search string that will be used to text match on the special rule entries. Tt will search both name and description
 * @return Returns an array of matching special rules
 */
export async function getSpecialRuleSearch ( searchString: string ) {
    
    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);
    
    // if a searchString is provided, then perform a mongo TEXT search
    let query = {};
    if ( searchString.length > 0 ) {
        query = { $text: { $search: searchString } };            
    }
    let sortFields = { "ruleType":1, "ruleName":1 };
    
    // find the query and return the results as an array
    let docs = await client.db("model-editor").collection("specialRules").find(query).sort(sortFields).toArray();

    // close the database
    client.close();
    
    // return the found array
    return docs;
}

/**
 * This method is used to find the list of models that match the searchString criteria
 *
 * @param searchString {string} This is the ID of the special rule that you want to retrieve
 * @return This is the returned special rule object
 */
export async function getSpecialRuleById (specialRuleId: string) {
    
    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);
    
    // find the special rule
    let query = { _id: specialRuleId };
    let ruleCursor = client.db("model-editor").collection("specialRules").find( query );
    let specialRule: any;
    if ( await ruleCursor.hasNext() ) {
        specialRule = await ruleCursor.next();
    } else {
        client.close();
        throw new Error( "Invalid id " + specialRuleId );
    }

    // close the database
    client.close();
    
    // return the found array
    return specialRule;
}

export async function addModel( newModel: any ) {

    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);

    // get the next model ID
    let sequenceDocument = await client.db("model-editor").collection("config").findOneAndUpdate( {_id:"modelIdSequence"}, {$inc:{sequenceValue:1}} );
    newModel._id = "M" + sequenceDocument.value.sequenceValue.toString().padStart(4,"0");
    
    // insert the special rule into the database
    await client.db("model-editor").collection("models").insertOne(newModel);
    
    // close the database
    client.close();

    // return the new id
    return newModel._id;
}

export async function updateModel( modelId: string, editModel: any ) {
    
    
    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);

    // update the model in the database
    await client.db("model-editor").collection("models").findOneAndReplace({ _id: modelId }, editModel );
    
    // close the database
    client.close();
    
    // return the id
    return modelId;
}

export async function updateSpecialRule( ruleId: string, editRule: any ) {
    
    
    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);

    // update the model in the database
    await client.db("model-editor").collection("specialRules").findOneAndReplace({ _id: ruleId }, editRule );
    
    // close the database
    client.close();
    
    // return the id
    return ruleId;
}

export async function deleteModel( modelId: string ) {
    
    
    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);

    // update the model in the database
    await client.db("model-editor").collection("models").deleteOne({ _id: modelId } );
    
    // close the database
    client.close();
    
    // return the id
    return modelId;
}

export async function deleteSpecialRule( ruleId: string ) {
    
    
    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);

    // update the model in the database
    await client.db("model-editor").collection("specialRules").deleteOne({ _id: ruleId } );
    
    // close the database
    client.close();
    
    // return the id
    return ruleId;
}

export async function addSpecialRule( newSpecialRule: any ) {

    // connect to the Mongo database
    let client = await mongoDb.MongoClient.connect(mongoDBUri);

    // get the next special rule ID
    let sequenceDocument = await client.db("model-editor").collection("config").findOneAndUpdate( {_id:"specialRuleIdSequence"}, {$inc:{sequenceValue:1}} );
    newSpecialRule._id = "S" + sequenceDocument.value.sequenceValue.toString().padStart(4,"0");
    
    // insert the special rule into the database
    await client.db("model-editor").collection("specialRules").insertOne(newSpecialRule);
    
    // close the database
    client.close();

    // return the new id
    return newSpecialRule._id;
}
