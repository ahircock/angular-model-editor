import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.css']
})
export class AppButtonComponent implements OnInit {

  @Input() image: string;
  @Input() title: string;
  @Output() clicked: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
