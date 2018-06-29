import { Directive, ElementRef, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[clickElsewhere]'
})
export class ClickElsewhereDirective {

  @Output() clickElsewhere = new EventEmitter<MouseEvent>();

  constructor(
    private elementRef: ElementRef
  ) { }

  @HostListener("document:click", ["$event"])
  public onDocumentClick(event: MouseEvent) {

    // get the element that was clicked
    const targetElement = event.target as HTMLElement;

    // check if the click was outside the element or one of its children
    if ( targetElement && !this.elementRef.nativeElement.contains(targetElement) ) {
      this.clickElsewhere.emit();
    }
  }

}
