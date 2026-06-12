import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfirmationDialog } from '../models/ConfirmationDialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  dialog$ = new Subject<{
    data: ConfirmationDialog;
    resolve: (result: boolean) => void;
  }>();

  confirm(data: ConfirmationDialog): Promise<boolean> {

    return new Promise(resolve => {

      this.dialog$.next({
        data,
        resolve
      });

    });

  }
}
