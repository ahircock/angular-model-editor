import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForceDataService, ForceData } from '../../services/force-data/force-data.service';

@Component({
  selector: 'app-force-print',
  templateUrl: './force-print.component.html',
  styleUrls: ['./force-print.component.css']
})
export class ForcePrintComponent implements OnInit {

  public force: ForceData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private forceDataService: ForceDataService
  ) { }

  async ngOnInit() {
    // load the force object
    let forceId = this.activatedRoute.snapshot.paramMap.get("id");
    this.force = await this.forceDataService.getForceById(forceId);
  }

}
