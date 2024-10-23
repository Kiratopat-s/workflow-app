import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { MobileFormatPipe } from '../../../shared/pipes/mobile-format.pipe';
import { ItemService } from '../../item.service';
import { Item, ItemStatus } from '../../models/item';
import { BudgetPlanComponent } from '../../components/budget-plan/budget-plan.component';
import { BudgetPlanService } from '../../budget-plan.service';
import { map } from 'rxjs';
import { LucideAngularModule, LogIn, KeyRound, LogOut, User, IdCard, Scroll, Stamp } from 'lucide-angular';

type ItemAction = 'Approve' | 'Reject';

@Component({
  selector: 'app-item-approval',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, MobileFormatPipe, BudgetPlanComponent, CommonModule, LucideAngularModule],
  templateUrl: './item-approval.component.html',
  styleUrl: './item-approval.component.scss'
})
export class ItemApprovalComponent {
  readonly icons = {
    Login: LogIn,
    Key: KeyRound,
    Logout: LogOut,
    User: User,
    IdCard: IdCard,
    Scroll: Scroll,
    Stamp: Stamp
  };

  itemService = inject(ItemService);
  budgetPlanService = inject(BudgetPlanService)

  items: Item[] = [];
  filterItems = this.items;
  filterInput = new FormControl<string>('', { nonNullable: true });

  modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;

  readonly ItemStatus = ItemStatus;

  constructor() {
    this.itemService.list().subscribe((vs) => {
      this.items = vs;
      this.filterItems = vs;
      this.updateUsed();

      this.filterInput.valueChanges
        .pipe(map((keyword) => keyword.toLocaleLowerCase()))
        .subscribe((keyword) => {
          this.filterItems = this.items.filter((item) =>
            item.title.toLocaleLowerCase().includes(keyword)
          );
        });
    });
  }

  onConfirm(item: Item, itemAction: ItemAction) {
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to ${itemAction} "${item.title}" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);
    this.bsModalRef?.onHidden?.subscribe(() => {
      if (this.bsModalRef?.content?.confirmed) {
        if (itemAction === 'Approve') {
          this.onApprove(item.id);
        }

        if (itemAction === 'Reject') {
          this.onReject(item.id);
        }
      }
    });
  }

  onApprove(id: number) {
    this.itemService.approve(id).subscribe(() => {
      this.items = this.items.map((v) => (v.id === id ? { ...v, status: ItemStatus.APPROVED } : v));
      this.itemService.list().subscribe((vs) => {
        this.items = vs;
        this.filterItems = vs;
        this.updateUsed();
      });
    });
  }

  onReject(id: number) {
    this.itemService.reject(id).subscribe(() => {
      this.items = this.items.map((v) => (v.id === id ? { ...v, status: ItemStatus.REJECTED } : v));
      this.itemService.list().subscribe((vs) => {
        this.items = vs;
        this.filterItems = vs;
        this.updateUsed();
      });
    });
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

    // reduce (sumFn, initValue)
    // sumFn = (previos, current) => (previos += current)
    // 1. (0, 600) => (0 += 600) then return to previos
    // 2. (600, 1200) => (600 + 1200) return to previos
    // 3. return 1800 as previos
  }

}
