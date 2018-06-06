import { DbConnector, RuleDBData, ModelDBData, ForceDBData } from './db-connector.interface';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

export class RestAPIConnector implements DbConnector {

  // this array will simulate the data that comes back from a database

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

    private apiUrlModels = environment.apiUrl + "/models";
    private apiUrlRules  = environment.apiUrl + "/rules";
    private apiUrlForces = environment.apiUrl + "/forces";

    constructor(
        private httpClient: HttpClient
    ) {}

    async getRules(): Promise<RuleDBData[]>{
        try {
            return ( this.httpClient.get(this.apiUrlRules).toPromise() as Promise<RuleDBData[]>);
        } catch (err) {
            console.log(err.toString());
        }
    }
    async createRule( newRule: RuleDBData ): Promise<RuleDBData> {
        try {
            return ( this.httpClient.post(this.apiUrlRules, newRule).toPromise() as Promise<RuleDBData>)
        } catch (err) {
            console.log(err.toString());
        }
    }
    async updateRule( updateRule: RuleDBData ): Promise<RuleDBData> {
        try {
            let url = this.apiUrlRules + "/" + updateRule._id;
            return ( this.httpClient.put(url, updateRule).toPromise() as Promise<RuleDBData>)
        } catch (err) {
            console.log(err.toString());
        }
    }
    async deleteRule( deleteRule: RuleDBData ): Promise<void> {
        try {
            let url = this.apiUrlRules + "/" + deleteRule._id;
            this.httpClient.delete(url).toPromise();
        } catch (err) {
            console.log(err.toString());
        }
    }

    async getModels(): Promise<ModelDBData[]> {
        try {
            return ( this.httpClient.get(this.apiUrlModels).toPromise() as Promise<ModelDBData[]>);
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
        try {
            return ( this.httpClient.get(this.apiUrlForces).toPromise() as Promise<ForceDBData[]>);
        } catch (err) {
            console.log(err.toString());
        }
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