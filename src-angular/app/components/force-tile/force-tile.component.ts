import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ForceData, ForceDataService } from '../../services/force-data/force-data.service';

@Component({
  selector: 'app-force-tile',
  templateUrl: './force-tile.component.html',
  styleUrls: ['./force-tile.component.css']
})
export class ForceTileComponent implements OnInit {

  @Input() force: ForceData;
  @Input() selected: boolean;
  @Output() change: EventEmitter<void> = new EventEmitter();
  @Output() select: EventEmitter<void> = new EventEmitter();

  constructor(
    private forceDataService: ForceDataService
  ) { }

  ngOnInit() {
  }

  async deleteForce() {
    await this.forceDataService.deleteForce( this.force );
    this.change.emit();
  }

}
