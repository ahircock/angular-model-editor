import { DbConnector, RuleDBData, ModelDBData, ForceDBData } from './db-connector.interface';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

export class RestAPIConnector implements DbConnector {

  // this array will simulate the data that comes back from a database
  private ruleDB: RuleDBData[] = [
    {_id:"R0001",type:"special",cost:2,name:"Armor Stance",text:"This model gains the following condition for one round: \u003ci\u003eArmor Stance\u003c/i\u003e - This model gets +2 ARM\n", AP:1 },
    {_id:"R0002",type:"attack",cost:2,name:"Stun",text:"Target model gets the following condition for one round (\u003ci\u003eStunned\u003c/i\u003e: This model gets -1 action point during its activation)", AP:1 },
    {_id:"R0003",type:"attack",cost:2,name:"Weaken",text:"Target model gets the following condition for one round (\u003ci\u003eWeakened\u003c/i\u003e: This model gets -2 DMG on all attacks)", AP:1 },
    {_id:"R0004",type:"model",cost:3,name:"Soul Collector",text:"This model can gain \u003ci\u003esoul tokens\u003c/i\u003e. When this model destroys a living enemy model with an attack, this model gains a soul token. This model can have up to three soul tokens at any time.\u003cbr\u003e\u003cli\u003e This model can spend a soul token to perform any \u003ci\u003esoul-powered\u003c/i\u003e action with AP 1 for free.\u003cbr\u003e\u003cli\u003e This model can spend a soul token to focus or boost any \u003ci\u003esoul-powered\u003c/i\u003e attack for free.", AP:1 },
    {_id:"R0005",type:"attack",cost:3,name:"Lucky Hit",text:"This attack may reroll failed HIT tests.", AP:1 },
    {_id:"R0012",type:"special",cost:3,name:"Healing Touch",text:"Target friendly model within 0\" receives a 6/0 heal test.", AP:1},
    {_id:"R0013",type:"model",cost:1,name:"Reckless Rage",text:"While damaged this model gets the following condition: (\u003ci\u003eReckless Rage\u003c/i\u003e: -2 EV and +2 DMG to melee attacks)", AP:1 },
    {_id:"R0014",type:"model",cost:2,name:"Berserk",text:"If this model destroys an enemy model with an attack, it must make a second melee attack with an AP cost of 1 against another model, friendly or enemy, within melee range. This additional attack costs no AP.", AP:1 },
    {_id:"R0015",type:"model",cost:4,name:"Fly",text:"This model can move through other models and impassable terrain, and does not suffer the slowing effects of difficult terrain. Only models that were engaging this model at the beginning of its movement may perform disengage attacks", AP:1 },
    {_id:"R0016",type:"attack",cost:2,name:"Armor Piercing",text:"Target model gets -2 ARM against this attack", AP:1 },
    {_id:"R0017",type:"attack",cost:4,name:"Incorporeal",text:"Target model’s ARM is 0 against this attack", AP:1 },
    {_id:"R0018",type:"special",cost:2,name:"Rapid Strike",text:"This model may make up to 3 melee attacks with AP 1 against a single target",AP:2},
    {_id:"R0019",type:"special",cost:2,name:"Rapid Fire",text:"This model may make up to 3 ranged attacks with AP 1 against a single target",AP:2},
    {_id:"R0020",type:"move",cost:3,name:"Leap",text:"This model moves up to its SPD stat, moving through intervening models and terrain without penalty. Only models that were engaging this model at the beginning of its movement may perform disengage attacks", AP:1 },
    {_id:"R0021",type:"command",cost:2,name:"Guard Him!",text:"Target friendly model within 12” gets the guarded condition (Guarded: If this model is damaged by an attack action, you may assign some all of the damage it suffers to another model within base to base contact, then this condition ends)",AP:1},
    {_id:"R0022",type:"command",cost:2,name:"You Must Protect!",text:"Target friendly model within 12” gets the bodyguard condition (Bodyguard: If a model in contact with this model is damaged by an attack action, you may assign some or all of the damage it suffers to this model, then this condition ends)",AP:1},
    {_id:"R0023",type:"command",cost:2,name:"Maneuver Drill!",text:"This model receives the maneuvers aura condition for one round (maneuvers aura: All friendly models within 12” of this model may move through other friendly models)",AP:1},
    {_id:"R0024",type:"command",cost:2,name:"Defensive Positions!",text:"This model receives the following condition for one round (\u003ci\u003eDefense Aura\u003c/i\u003e: If a friendly model within 12” of this model is in contact with another friendly model, it cannot be flanked)",AP:1},
    {_id:"R0025",type:"command",cost:2,name:"Reform!",text:"All friendly models within 6” may immediately perform a Reposition action in whatever order you choose",AP:1},
    {_id:"R0026",type:"command",cost:2,name:"Strike!",text:"Target friendly model within 12” may immediately perform an attack action",AP:1},
    {_id:"R0027",type:"attack",cost:3,name:"Lucky Damage",text:"This attack may reroll failed DMG tests.", AP:1 },
    {_id:"R0028",type:"model",cost:4,name:"Melee Expert",text:"This model gains 1 additional AP which may only be used to make melee attacks", AP:1 }
  ];

  private modelDB: ModelDBData[] = [
    {_id:"M0000",template: true,name:"Basic Model",traits:null,picture:"basic.jpg",SPD:5,EV:5,ARM:0,HP:5,specialRuleIds:[],actions:[{type:"MELEE",name:"Basic Weapon",traits:null,AP:1,RNG:1,HIT:6,DMG:6,ONCE:false,specialRuleIds:[]}]},    
    {_id:"M0001",template: true,name:"Templar General",traits:"Templar",picture:"templar - general.jpg",SPD:5,EV:5,ARM:4,HP:8,specialRuleIds:[],actions:[{type:"MELEE",name:"Warhammer",traits:null,AP:1,RNG:0,HIT:7,DMG:5,ONCE:false,specialRuleIds:[]}]},
    {_id:"M0002",template: true,name:"Templar Knight",traits:"Templar",picture:"templar - knight.jpg",SPD:5,EV:5,ARM:3,HP:8,specialRuleIds:[],actions:[{type:"MELEE",name:"Warhammer",traits:null,AP:1,RNG:1,HIT:7,DMG:7,ONCE:false,specialRuleIds:[]},{type:"SPECIAL",name:"Shield Wall",traits:"",AP:1,RNG:0,HIT:0,DMG:0,ONCE:false,specialRuleIds:["R0001"]}]},
    {_id:"M0003",template: true,name:"Templar Paladin",traits:"Templar",picture:"templar - paladin.jpg",SPD:5,EV:5,ARM:3,HP:8,specialRuleIds:[],actions:[{type:"MELEE",name:"StarMaul",traits:null,AP:1,RNG:2,HIT:8,DMG:9,ONCE:false,specialRuleIds:["R0002"]}]},
    {_id:"M0004",template: true,name:"Templar Soulwarden",traits:"Templar, Hero",picture:"templar - soulwarden.jpg",SPD:5,EV:5,ARM:3,HP:10,specialRuleIds:["R0004"],actions:[{type:"MELEE",name:"Relic Hammer",traits:"",AP:1,RNG:1,HIT:7,DMG:7,ONCE:false,specialRuleIds:[]},{type:"RANGED",name:"Soul Fire",traits:"soul-powered",AP:1,RNG:12,HIT:6,DMG:6,ONCE:false,specialRuleIds:["R0003"]},{type:"SPECIAL",name:"Reinforce Soul",traits:"soul-powered",AP:1,RNG:0,HIT:0,DMG:0,ONCE:false,specialRuleIds:["R0012"]}]},
    {_id:"M0005",template: true,name:"Chaos Marauder",traits:"Chaos",picture:"chaos - marauder.jpg",SPD:6,EV:5,ARM:0,HP:5,specialRuleIds:[],actions:[{type:"MELEE",name:"Reaver Blade",traits:"",AP:1,RNG:1,HIT:6,DMG:6,ONCE:false,specialRuleIds:[]}]},
    {_id:"M0007",template: true,name:"Chaos Warrior",traits:"Chaos",picture:"chaos - warrior.jpg",SPD:5,EV:5,ARM:3,HP:8,specialRuleIds:[],actions:[{type:"MELEE",name:"GoreAxe",traits:"",AP:1,RNG:1,HIT:7,DMG:7,ONCE:false,specialRuleIds:[]},{type:"SPECIAL",name:"Frenzy",traits:"",AP:2,RNG:0,HIT:0,DMG:0,ONCE:false,specialRuleIds:["R0018"]}]},
    {_id:"M0008",template: true,name:"Chaos Champion",traits:"Chaos",picture:"chaos - general.jpg",SPD:5,EV:5,ARM:3,HP:10,specialRuleIds:["R0028","R0014"],actions:[{type:"MELEE",name:"Demon Axe",traits:"",AP:1,RNG:1,HIT:9,DMG:7,ONCE:false,specialRuleIds:["R0016"]}]},
    {_id:"M0009",template: true,name:"Templar (Basic)",traits:"Templar",picture:"basic.jpg",SPD:5,EV:5,ARM:3,HP:8,specialRuleIds:[],actions:[{type:"MELEE",name:"Templar Weapon",traits:null,AP:1,RNG:1,HIT:7,DMG:7,ONCE:false,specialRuleIds:[]}]},
    {_id:"M0021",template: false,name:"Templar Soulwarden1",traits:"Templar, Hero",picture:"templar - soulwarden.jpg",SPD:5,EV:5,ARM:3,HP:10,specialRuleIds:[],actions:[{type:"MELEE",name:"Relic Hammer",traits:"",AP:1,RNG:1,HIT:7,DMG:7,ONCE:false,specialRuleIds:[]},{type:"RANGED",name:"Soul Fire",traits:"soul-powered",AP:1,RNG:12,HIT:6,DMG:6,ONCE:false,specialRuleIds:[]},{type:"SPECIAL",name:"Reinforce Soul",traits:"soul-powered",AP:1,RNG:0,HIT:0,DMG:0,ONCE:false,specialRuleIds:["R0012"]}]},
    {_id:"M0022",template: false,name:"Templar Knight",traits:"Templar",picture:"templar - knight.jpg",SPD:5,EV:5,ARM:3,HP:8,specialRuleIds:[],actions:[{type:"MELEE",name:"Warhammer",traits:null,AP:1,RNG:1,HIT:7,DMG:7,ONCE:false,specialRuleIds:[]},{type:"SPECIAL",name:"Shield Wall",traits:"",AP:1,RNG:0,HIT:0,DMG:0,ONCE:false,specialRuleIds:["R0001"]}]},
    {_id:"M0023",template: false,name:"Templar Paladin",traits:"Templar",picture:"templar - paladin.jpg",SPD:5,EV:5,ARM:3,HP:8,specialRuleIds:[],actions:[{type:"MELEE",name:"StarMaul",traits:null,AP:1,RNG:2,HIT:8,DMG:9,ONCE:false,specialRuleIds:["R0002"]}]},
    {_id:"M0031",template: false,name:"Chaos Champion",traits:"Chaos",picture:"chaos - general.jpg",SPD:5,EV:5,ARM:3,HP:10,specialRuleIds:["R0028","R0014"],actions:[{type:"MELEE",name:"Demon Axe",traits:"",AP:1,RNG:1,HIT:9,DMG:7,ONCE:false,specialRuleIds:["R0016"]}]},
    {_id:"M0032",template: false,name:"Chaos Warrior",traits:"Chaos",picture:"chaos - warrior.jpg",SPD:5,EV:5,ARM:3,HP:8,specialRuleIds:[],actions:[{type:"MELEE",name:"GoreAxe",traits:"",AP:1,RNG:1,HIT:7,DMG:7,ONCE:false,specialRuleIds:[]},{type:"SPECIAL",name:"Frenzy",traits:"",AP:2,RNG:0,HIT:0,DMG:0,ONCE:false,specialRuleIds:["R0018"]}]},
    {_id:"M0033",template: false,name:"Chaos Marauder",traits:"Chaos",picture:"chaos - marauder.jpg",SPD:6,EV:5,ARM:0,HP:5,specialRuleIds:[],actions:[{type:"MELEE",name:"Reaver Blade",traits:"",AP:1,RNG:1,HIT:6,DMG:6,ONCE:false,specialRuleIds:[]}]}
  ];

  private forceDB: ForceDBData[] = [
    { _id:"F0001", name:"Templar Attack!", size:"standard", models:[{_id:"M0021",count:1},{_id:"M0023",count:2},{_id:"M0022",count:3}] },
    { _id:"F0002", name:"Khorne Bloodbound", size:"standard", models:[{_id:"M0031",count:1},{_id:"M0032",count:3},{_id:"M0033",count:6}] }
  ];

  private nextId: number = 100;

    constructor(
        private httpClient: HttpClient
    ) {}

    async getRules(): Promise<RuleDBData[]>{
        return JSON.parse(JSON.stringify(this.ruleDB));
    }
    async createRule( newRule: RuleDBData ): Promise<RuleDBData> {
        this.ruleDB.push( JSON.parse(JSON.stringify(newRule)) );
        return JSON.parse(JSON.stringify(newRule));
    }
    async updateRule( updateRule: RuleDBData ): Promise<RuleDBData> {
        let findRuleIndex: number = this.ruleDB.findIndex( element => element._id == updateRule._id );
        this.ruleDB[findRuleIndex] = JSON.parse(JSON.stringify(updateRule));
        return JSON.parse(JSON.stringify(updateRule));
    }
    async deleteRule( deleteRule: RuleDBData ): Promise<void> {
        let findRuleIndex: number = this.ruleDB.findIndex( element => element._id == deleteRule._id );
        this.ruleDB.splice(findRuleIndex, 1 );
        return;
    }

    async getModels(): Promise<ModelDBData[]> {
        try {
            return ( this.httpClient.get(environment.apiUrl).toPromise() as Promise<ModelDBData[]>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async createModel( newModel: ModelDBData ): Promise<ModelDBData> {
        return JSON.parse(JSON.stringify(newModel));
    }
    updateModel( updateModel: ModelDBData ): Promise<ModelDBData> {
        return JSON.parse(JSON.stringify(updateModel));
    }
    deleteModel( deleteModel: ModelDBData ): Promise<void> {
        return;
    }

    async getForces(): Promise<ForceDBData[]> {
        return JSON.parse(JSON.stringify(this.forceDB));
    }
    async createForce( newForce: ForceDBData ): Promise<ForceDBData> {
        this.forceDB.push( JSON.parse(JSON.stringify(newForce)) );
        return JSON.parse(JSON.stringify(newForce));
    }
    updateForce( updateForce: ForceDBData ): Promise<ForceDBData> {
        let findRuleIndex: number = this.forceDB.findIndex( element => element._id == updateForce._id );
        this.forceDB[findRuleIndex] = JSON.parse(JSON.stringify(updateForce));
        return JSON.parse(JSON.stringify(updateForce));
    }
    deleteForce( deleteForce: ForceDBData ): Promise<void> {
        let findRuleIndex: number = this.forceDB.findIndex( element => element._id == deleteForce._id );
        this.forceDB.splice(findRuleIndex, 1 );
        return;
    }
       

    /**
     * Generate the next ID in the sequence
     * @param prefix this is an optional  prefix to add to the beginning of the ID. Defaulted to blank
     */
    async getNextId( prefix: string ): Promise<string> {
        return prefix + this.nextId++;
    }
        
}