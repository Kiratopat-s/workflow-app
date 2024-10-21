import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, Location } from '@angular/common';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent {

  location = inject(Location);

  fb = inject(NonNullableFormBuilder)

  // formControls
  title = this.fb.control<string>('', { validators: Validators.required });
  contactMobileNo = this.fb.control<string>('', { validators: Validators.required });
  amount = this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(1)] });
  price = this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(0.5)] });

  // formGroup
  fg = this.fb.group({
    title: this.title,
    contactMobileNo: this.contactMobileNo,
    amount: this.amount,
    price: this.price
  })

  onBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    console.log(this.fg.getRawValue())
  }
}
