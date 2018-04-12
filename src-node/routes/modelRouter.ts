import * as modelService from '../services/modelService';
import * as express from 'express';

// setup all of the URL handlers
const router = express.Router();
router.get('/model/search', getModelSearchHandler);
router.get('/model/getbyid', getModelByIdHandler)
router.post('/model/add', addModelHandler);
router.post('/model/update', updateModelHandler);
router.post('/model/delete', deleteModelHandler);
router.post('/specialrule/update', updateSpecialRuleHandler);
router.post('/specialrule/add', addSpecialRuleHandler);
router.post('/specialrule/delete', deleteSpecialRuleHandler);
router.get('/specialrule/search', getSpecialRuleSearchHandler);
router.get('/specialrule/getbyid', getSpecialRuleByIdHandler);

async function getModelByIdHandler(req: express.Request, res: express.Response) {

    try {
        // make sure that "id" query parameter was provided
        if ( typeof(req.query.id) == "undefined" ) {
            throw new Error( "Must provide the id query parm in the URL")
        }
        
        // do you want to return special rule text?
        let provideRuleText = true;
        if ( typeof(req.query.provideRuleText) != "undefined" && req.query.provideRuleText == "NO" ) {
            provideRuleText = false;
        }

        let model = await modelService.getModelById(req.query.id, provideRuleText);
        res.status(200).send(JSON.stringify(model));
        
    // if any error occurred, return a HTTP Status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};

async function addModelHandler(req: express.Request, res: express.Response) {

    try {
        
        // add the model entry and return the new modelEntryId
        let modelEntryId = await modelService.addModel(req.body);
       
        // wrap the modelEntryId in an object and return it
        let responseObject = { "newModelId" : modelEntryId };
        res.status(200).send(JSON.stringify(responseObject));
    
    // if there was an error, return HTTP status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
};

async function addSpecialRuleHandler(req: express.Request, res: express.Response) {

    try {
        
        // add the model entry and return the new modelEntryId
        let ruleId = await modelService.addSpecialRule(req.body);
        
        // wrap the modelEntryId in an object and return it
        let responseObject = { "newSpecialRuleId" : ruleId };
        res.status(200).send(JSON.stringify(responseObject));
    
    // if there was an error, return HTTP status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
};

async function updateModelHandler(req: express.Request, res: express.Response) {

    try {
        
        // make sure that "id" query parameter was provided
        if ( typeof(req.query.id) == "undefined" ) {
            throw new Error( "Must provide the id query parm in the URL")
        }
        
        // add the model entry and return the new modelEntryId
        let modelId = await modelService.updateModel(req.query.id, req.body);
        
        // wrap the modelEntryId in an object and return it
        let responseObject = { "editModelId" : modelId };
        res.status(200).send(JSON.stringify(responseObject));
    
    // if there was an error, return HTTP status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
};

async function updateSpecialRuleHandler(req: express.Request, res: express.Response) {

    try {
        
        // make sure that "id" query parameter was provided
        if ( typeof(req.query.id) == "undefined" ) {
            throw new Error( "Must provide the id query parm in the URL")
        }
        
        // add the model entry and return the new modelEntryId
        let ruleId = await modelService.updateSpecialRule(req.query.id, req.body);
        
        // wrap the modelEntryId in an object and return it
        let responseObject = { "editSpecialRuleId" : ruleId };
        res.status(200).send(JSON.stringify(responseObject));
    
    // if there was an error, return HTTP status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
};

async function deleteModelHandler(req: express.Request, res: express.Response) {

    try {
        
        // make sure that "id" query parameter was provided
        if ( typeof(req.query.id) == "undefined" ) {
            throw new Error( "Must provide the id query parm in the URL")
        }
        
        // add the model entry and return the new modelEntryId
        let modelId = await modelService.deleteModel(req.query.id);
        
        // wrap the modelEntryId in an object and return it
        let responseObject = { "deleteModelId" : modelId };
        res.status(200).send(JSON.stringify(responseObject));
    
    // if there was an error, return HTTP status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
};

async function deleteSpecialRuleHandler(req: express.Request, res: express.Response) {

    try {
        
        // make sure that "id" query parameter was provided
        if ( typeof(req.query.id) == "undefined" ) {
            throw new Error( "Must provide the id query parm in the URL")
        }
        
        // add the model entry and return the new modelEntryId
        let specialRuleId = await modelService.deleteSpecialRule(req.query.id);
        
        // wrap the modelEntryId in an object and return it
        let responseObject = { "deleteSpecialRuleId" : specialRuleId };
        res.status(200).send(JSON.stringify(responseObject));
    
    // if there was an error, return HTTP status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
};

async function getModelSearchHandler(req: express.Request, res: express.Response) {

    try {
        
        // make sure that "searchString" query parameter was provided
        if ( typeof(req.query.searchString) == "undefined" ) {
            throw new Error( "Must provide the searchString query parm in the URL")
        }

        let modelList = await modelService.getModelSearch(req.query.searchString);
        res.status(200).send(modelList);
        
    // if any error occurred, return a HTTP Status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};

async function getSpecialRuleSearchHandler(req: express.Request, res: express.Response) {

    try {
        
        // make sure that "searchString" query parameter was provided
        if ( typeof(req.query.searchString) == "undefined" ) {
            throw new Error( "Must provide the searchString parm in the URL query")
        }

        let modelList = await modelService.getSpecialRuleSearch(req.query.searchString);
        res.status(200).send(modelList);
        
    // if any error occurred, return a HTTP Status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString());
    }
    
};

async function getSpecialRuleByIdHandler(req: express.Request, res: express.Response) {

    try {
        
        // make sure that "searchString" query parameter was provided
        if ( typeof(req.query.id) == "undefined" ) {
            throw new Error( "Must provide the id query parm in the URL")
        }

        let specialRule = await modelService.getSpecialRuleById(req.query.id);
        res.status(200).send(JSON.stringify(specialRule));
        
    // if any error occurred, return a HTTP Status 500 with the error message
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};

export default router;