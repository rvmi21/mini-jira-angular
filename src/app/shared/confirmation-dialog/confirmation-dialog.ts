import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css'
})
export class ConfirmationDialogComponent {

  private confirmation = inject(ConfirmationService);

  visible = false;

  title = '';
  message = '';

  private resolver?: (result: boolean) => void;

  ngOnInit() {

    this.confirmation.dialog$
      .subscribe(dialog => {

        this.visible = true;

        this.title = dialog.data.title;
        this.message = dialog.data.message;

        this.resolver = dialog.resolve;

      });

  }

  confirm() {

    this.resolver?.(true);

    this.close();

  }

  cancel() {

    this.resolver?.(false);

    this.close();

  }

  close() {

    this.visible = false;

  }
}
