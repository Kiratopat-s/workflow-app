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

  // formControls
  title = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  contactMobileNo = new FormControl<string>('', { nonNullable: true })

  // formGroup
  fg = new FormGroup({
    title: this.title,
    contactMobileNo: this.contactMobileNo
  })

  onBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    console.log(this.fg.getRawValue())
  }
}
