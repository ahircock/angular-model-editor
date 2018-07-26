// *** DB-CONNECTOR INTERFACE

/**
 * This is the abstract class that all database connectors must extend
 */
export abstract class DbConnectService {

    abstract async getRules(): Promise<RuleDBData[]>;
    abstract async createRule( newRule: RuleDBData ): Promise<RuleDBData>;
    abstract async updateRule( updateRule: RuleDBData ): Promise<RuleDBData>;
    abstract async deleteRule( deleteRule: RuleDBData ): Promise<void>;

    abstract async getModels(): Promise<ModelDBData[]>;
    abstract async createModel( newModel: ModelDBData ): Promise<ModelDBData>;
    abstract async updateModel( updateModel: ModelDBData ): Promise<ModelDBData>;
    abstract async deleteModel( deleteModel: ModelDBData ): Promise<void>;
    
    abstract async getForces(): Promise<ForceDBData[]>;
    abstract async createForce( newForce: ForceDBData ): Promise<ForceDBData>;
    abstract async updateForce( updateForce: ForceDBData ): Promise<ForceDBData>;
    abstract async deleteForce( deleteForce: ForceDBData ): Promise<void>;

    abstract async getActions(): Promise<ActionDBData[]>;
    abstract async createAction( newAction: ActionDBData ): Promise<ActionDBData>;
    abstract async updateAction( updateAction: ActionDBData ): Promise<ActionDBData>;
    abstract async deleteAction( deleteAction: ActionDBData ): Promise<void>;

    abstract async getNextId( prefix: string ): Promise<string>;

    abstract async login( email: string, password: string ): Promise<void>;
    abstract async signup( email: string, password: string ): Promise<void>;

}

// *** DB DATA STRUCTURES 

/**
 * List of possible rule types
 */
export const enum RuleType {
    Special = "special",
    Attack = "attack",
    Model = "model"
}
  
  /**
 * Structure of Rule data, as stored in the database
 */
export interface RuleDBData {
    _id: string;
    userId: string;
    type: RuleType;
    name: string;
    text: string;
    cost?: number;
    modSPD?: number;
    modEV?: number;
    modARM?: number;
    modHP?: number;
    modStrDMG?: number;
    modMHIT?: number;
    modRHIT?: number
}

/**
 * Structure of Model data, as stored in the database
 */
export interface ModelDBData {
    _id: string;
    userId: string;
    template: boolean,
    name: string;
    traits: string;
    picture: string;
    SPD: number;
    EV: number;
    ARM: number;
    HP: number;
    specialRuleIds: string[];
    actions: ModelActionDBData[];
}
export interface ModelActionDBData {
    modelActionName: string;
    actionId: string;
}

/**
 * Structure of Force data, as stored in the database
 */
export interface ForceDBData {
    _id: string,
    userId: string,
    name: string,
    size: string,
    models: ForceModelDBData[]
} 
export interface ForceModelDBData {
    _id: string,
    count: number 
}

/**
 * List of possible action types
 */
export const enum ActionType {
    Special = "SPECIAL",
    Melee = "MELEE",
    Ranged = "RANGED"
}
  
/**
 * Structure of Action data, as stored in the database
 */
export interface ActionDBData {
    _id: string;
    userId: string;
    type: ActionType;
    name: string;
    traits: string;
    AP: number;
    RNG: number;
    HIT: number;
    DMG: number;
    strengthBased: boolean;
    ONCE: boolean;
    cost: number;
    specialRuleIds: string[];
}

/**
 * Structure of user & login data
 */
export interface UserDBData {
    userId: string
}

/**
 * Structure of error codes that are thrown by this method
 */
export interface DBErrorData {
    errorCode: number,
    errorMessage: string
}
  
