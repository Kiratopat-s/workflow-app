import { Component, inject, TemplateRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ItemService } from '../../item.service';
import { Item, ItemStatus } from '../../models/item';
import { MobileFormatPipe } from '../../../shared/pipes/mobile-format.pipe';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { BudgetPlanComponent } from "../../components/budget-plan/budget-plan.component";
import { BudgetPlanService } from '../../budget-plan.service';
import { LucideAngularModule, LogIn, KeyRound, LogOut, User, IdCard, Scroll, Stamp } from 'lucide-angular';

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MobileFormatPipe, DecimalPipe, RouterLink, BudgetPlanComponent, CommonModule, LucideAngularModule],
  templateUrl: './item-entry.component.html',
  styleUrl: './item-entry.component.scss'
})
export class ItemEntryComponent {
  readonly icons = {
    Login: LogIn,
    Key: KeyRound,
    Logout: LogOut,
    User: User,
    IdCard: IdCard,
    Scroll: Scroll,
    Stamp: Stamp
  };
  isSmallTable = false;

  itemService = inject(ItemService);
  budgetPlanService = inject(BudgetPlanService);

  items: Item[] = [];
  filterItems = this.items;
  filterInput = new FormControl<string>('', { nonNullable: true });

  modalService = inject(BsModalService)
  bsModalRef?: BsModalRef;

  constructor() {
    this.itemService.list().subscribe((vs) => {
      this.items = vs;
      this.filterItems = vs;
      this.updateUsed();
    });

    this.filterInput.valueChanges
      .pipe(map((keyword) => keyword.toLocaleLowerCase()))
      .subscribe((keyword) => {
        this.filterItems = this.items.filter((item) =>
          item.title.toLocaleLowerCase().includes(keyword)
        );
      });
  }

  onConfirm(item: Item) {
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to delete "${item.title}" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);
    this.bsModalRef?.onHidden?.subscribe(() => {
      if (this.bsModalRef?.content?.confirmed) {
        this.onDelete(item.id)
      }
    })

  }

  onDelete(id: number) {
    this.itemService.delete(id).subscribe(() => this.filterItems = this.filterItems.filter(v => v.id != id));
  }

  onFilter(status: string): void {
    if (status === 'ALL') {
      this.filterItems = this.items;
    } else {
      this.filterItems = this.items.filter((item) => item.status === status);
    }
  }
  private updateUsed() {
    const used = this.items
      .filter((v) => v.status === ItemStatus.APPROVED) // [{ id: 5, price: 600, ... }, { id: 8, price: 1200, ... }]
      .map((v) => Number(v.amount)) // [600, 1200]
      .reduce((previous: number, current: number) => previous + current, 0);

    this.budgetPlanService.updateUsed(used);
  }
}
