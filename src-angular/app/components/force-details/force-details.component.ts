import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForceData } from '../../services/force-data/force-data.service';
import { ModelData } from '../../services/model-data/model-data.service';

@Component({
  selector: 'app-force-details',
  templateUrl: './force-details.component.html',
  styleUrls: ['./force-details.component.css']
})
export class ForceDetailsComponent implements OnInit {

  public id: string;
  public force: ForceData;
  public models: ModelData[];

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    // get the force-data
    // get an array of models from the force-data
  }

}
