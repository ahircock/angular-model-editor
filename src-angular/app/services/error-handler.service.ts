import { ErrorHandler, Injectable} from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../components/common/error-dialog/error-dialog.component';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {

  constructor(
    private errorDialog: MatDialog
  ) { }

  handleError(error: any) {
    this.displayError(error);
    throw error;
  }

  displayError(error: any) {
    this.errorDialog.open( ErrorDialogComponent, {data: error.message} );
  }

}
