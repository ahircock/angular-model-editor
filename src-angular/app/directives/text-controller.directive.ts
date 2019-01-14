import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 *
 */
@Directive({
  selector: '[appTextController]'
})
export class TextControllerDirective {

  private origText = '';

  constructor(
    private element: ElementRef
  ) { }

  /**
   * Whenever the control receives focus, select everything and store the original value
   */
  @HostListener('focus')
  onFocus() {
    this.element.nativeElement.select();
    this.origText = this.element.nativeElement.value;
  }

  /**
   * Whenever ENTER is pressed, lose focus
   */
  @HostListener('keyup.enter')
  onKekupEnter() {
    if ( this.element.nativeElement.type !== 'textarea' ) {
      this.element.nativeElement.blur();
    }
  }

  /**
   * Whenever CTRL+ENTER is pressed in a textarea, lose focus
   */
  @HostListener('keyup.control.enter')
  onKekupControlEnter() {
    if ( this.element.nativeElement.type === 'textarea' ) {
      this.element.nativeElement.blur();
    }
  }
  /**
   * Whenever ESC is pressed, revert the text and lose focus
   */
  @HostListener('keyup.escape')
  onKekupEscape() {

    // revert the value and then trigger an input event so that the [(ngModel)] works properly
    this.element.nativeElement.value = this.origText;
    const inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
    this.element.nativeElement.dispatchEvent(inputEvent);

    // leave focus
    this.element.nativeElement.blur();
  }
}
