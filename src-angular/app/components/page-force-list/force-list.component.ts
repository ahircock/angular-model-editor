import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForceDataService, ForceData  } from '../../services/force-data.service';
import { UserService } from '../../services/user.service';
import { FactionData, FactionDataService } from '../../services/faction-data.service';

@Component({
  selector: 'app-force-list',
  templateUrl: './force-list.component.html',
  styleUrls: ['./force-list.component.css']
})
export class ForceListComponent implements OnInit {

  public forces: ForceData[];
  public factions: FactionData[];
  public showFactionListDropdown = false;

  constructor(
    private forceDataService: ForceDataService,
    private factionDataService: FactionDataService,
    private router: Router,
    private userService: UserService
  ) { }

  async ngOnInit() {

    // if not logged in, then go to login page
    if ( !this.userService.isLoggedIn() ) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.factions = await this.factionDataService.getAllFactions();

    this.forces = await this.forceDataService.getAllForces();
  }

  async newForce( faction: FactionData ) {
    const newForce: ForceData = await this.forceDataService.createForce(faction);
    this.openForce( newForce );
  }

  openForce( force: ForceData ) {
    this.router.navigateByUrl('/force/' + force._id );
  }

  async deleteForce(force: ForceData) {
    await this.forceDataService.deleteForce( force );
    this.forces = await this.forceDataService.getAllForces();
  }
}
