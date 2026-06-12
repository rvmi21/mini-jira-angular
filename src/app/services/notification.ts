import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Toast } from '../models/toast';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  toast$ = new Subject<Toast>();

  success(message: string) {
    this.toast$.next({
      message,
      type: 'success'
    });
  }

  error(message: string) {
    this.toast$.next({
      message,
      type: 'error'
    });
  }

  warning(message: string) {
    this.toast$.next({
      message,
      type: 'warning'
    });
  }

  confirm(message: string): boolean {
    return confirm(message);
  }
}
