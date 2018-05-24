// *** CONNECTOR INTERFACE

/**
 * This is the interface that all database connectors must implement
 */
export interface DbConnector {

    getRules: () => Promise<RuleDBData[]>;
    createRule: ( newRule: RuleDBData ) => Promise<RuleDBData>;
    updateRule: ( updateRule: RuleDBData ) => Promise<RuleDBData>;
    deleteRule: ( deleteRule: RuleDBData ) => Promise<void>;

    // getModels: () => Promise<ModelDBData[]>;
    // createModel: () => Promise<ModelDBData>;
    // updateModel: ( updateModel: ModelDBData ) => Promise<ModelDBData>;
    // deleteModel: ( deleteModel: ModelDBData ) => Promise<void>;
    
    // getForces: () => Promise<ForceDBData[]>;
    // createForce: () => Promise<ForceDBData>;
    // updateForce: ( updateForce: ForceDBData ) => Promise<ForceDBData>;
    // deleteForce: ( deleteForce: ForceDBData ) => Promise<void>;

    getNextId: ( prefix: string ) => Promise<string>;
}

// *** DB DATA STRUCTURES 

/**
 * Structure of Rule data, as stored in the database
 */
export interface RuleDBData {
    _id: string;
    type: string;
    name: string;
    text: string;
    cost: number;
    AP?: number;
}

/**
 * Structure of Force data, as stored in the database
 */
// export interface ForceDBData {
//     _id: string,
//     name: string,
//     size: string,
//     models: ForceModelDBData[]
// } 
// export interface ForceModelDBData {
//     modelId: string,
//     count: number 
// }
  
// /**
//  * Structure of Model data, as stored in the database
//  */
// export interface ModelDBData {
//     _id: string;
//     template: boolean,
//     name: string;
//     traits?: string;
//     picture: string;
//     cost: number;
//     SPD: number;
//     EV: number;
//     ARM: number;
//     HP: number;
//     specialRuleIds: string[];
//     actions: ModelActionDBData[];
// }
// export interface ModelActionDBData {
//     type: string;
//     name: string;
//     traits?: string;
//     AP: number;
//     RNG?: number;
//     HIT?: number;
//     DMG?: number;
//     ONCE?: boolean;
//     specialRuleIds: string[];
// }

