import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification';
import { Toast } from '../../models/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {

  private notification = inject(NotificationService);

  toasts: Toast[] = [];

  ngOnInit() {

    this.notification.toast$
      .subscribe(toast => {

        this.toasts.push(toast);

        setTimeout(() => {
          this.toasts.shift();
        }, 3000);

      });
  }
}
