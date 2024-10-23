import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, Location } from '@angular/common';
import { ItemService } from '../../item.service';
import { ItemStatus } from '../../models/item';
import { CanComponentDeactivate } from '../../../auth/guards/can-deactivate.guard';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent implements OnInit, CanComponentDeactivate {

  headerText: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  @Input()
  id: number | null = null;

  location = inject(Location);
  fb = inject(NonNullableFormBuilder);
  itemService = inject(ItemService);
  modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;

  title = new FormControl<string>('', { validators: Validators.required });
  amount = new FormControl<number>(0, { validators: [Validators.required, Validators.min(0.01)] });
  quantity = new FormControl<number>(1, { validators: [Validators.required, Validators.min(1)] });

  // Grouping form controls
  fg = this.fb.group({
    title: this.title,
    amount: this.amount,
    quantity: this.quantity,
  });

  ngOnInit() {
    this.route.url.subscribe(urlSegments => {
      const lastSegment = urlSegments[urlSegments.length - 1].path;
      const beforeLastSegment = urlSegments[urlSegments.length - 2]?.path;
      if (beforeLastSegment === 'item-edit') {
        this.headerText = 'Edit';
      } else if (lastSegment === 'item-add') {
        this.headerText = 'Add';
      }
    });

    if (this.id) {
      // Populate form with data if editing an existing item
      this.itemService.get(this.id).subscribe(v => this.fg.patchValue(v));
    }
  }

  // Navigate back to the previous location
  onBack(): void {
    this.location.back();
  }

  // Form submission handling
  onSubmit(): void {
    // Check if form is valid before submitting
    if (this.fg.invalid) {
      this.fg.markAllAsTouched(); // Highlights invalid fields
      return;
    }

    const rawValue = this.fg.getRawValue();
    const item = this.prepareItemForSubmission(rawValue);

    // Check if editing or adding a new item
    if (this.id) {
      this.itemService.edit(this.id, item).subscribe({
        next: () => this.onBack(),
        error: err => this.handleSubmissionError(err)
      });
    } else {
      this.itemService.add(item).subscribe({
        next: () => this.onBack(),
        error: err => this.handleSubmissionError(err)
      });
    }
  }

  private prepareItemForSubmission(rawValue: any) {
    return {
      ...rawValue,
      title: rawValue.title ?? 'Untitled',
      amount: parseFloat(rawValue.amount) ?? 0,
      quantity: rawValue.quantity ?? 1,
    };
  }

  private handleSubmissionError(err: any) {
    console.error('Submission failed', err);
  }

  // Guard method to handle unsaved changes before navigating away
  canDeactivate(): boolean | Observable<boolean> {
    if (!this.fg.dirty) {
      return true;
    }

    // Show confirmation modal if form is dirty
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to leave?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);

    return new Observable<boolean>((observer) => {
      this.bsModalRef?.onHidden?.subscribe(() => {
        observer.next(this.bsModalRef?.content?.confirmed);
        observer.complete();
      });
    });
  }
}
