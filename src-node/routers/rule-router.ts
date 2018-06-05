import { ServiceManager } from '../service-manager';
import { RuleService } from '../services/rule-service';
import { Router, Request, Response } from 'express';

// Create a router object and export it
const router = Router();
export default router;

// map the URL to the handlers
router.get('/', getAllHandler);
router.get('/:id', getByIdHandler);
router.post('', createHandler);
router.put('/:id', updateHandler);
router.delete('/:id', deleteHandler);

// here is the rule service that will be used to do all db work
const ruleService: RuleService = ServiceManager.getService("rule-service");

async function getAllHandler(req: Request, res: Response) {

    try {
        let docs = await ruleService.getAllRules();
        res.status(200).send(docs);
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};

async function getByIdHandler(req: Request, res: Response) {

    try {
        let getId = req.params.id;
        let docs = await ruleService.getRuleById(getId);
        res.status(200).send(docs);
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};

async function createHandler(req: Request, res: Response) {

    try {
        let passedDoc = req.body;
        let newDoc = await ruleService.createRule(passedDoc);
        res.status(200).send(newDoc);
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};

async function updateHandler(req: Request, res: Response) {

    try {
        let passedDoc = req.body;
        let updatedDoc = await ruleService.updateRule(passedDoc);
        res.status(200).send(updatedDoc);
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};

async function deleteHandler(req: Request, res: Response) {

    try {
        let deleteId = req.params.id;
        let updatedDoc = await ruleService.deleteRule(deleteId);
        res.status(200).send(updatedDoc);
    } catch (err) {
        res.status(500).send(err.toString()); 
    }
    
};


