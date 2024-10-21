import { Injectable } from '@angular/core';
import { BudgetPlan } from './models/budget-plan';

const YEAR_BUDGETS = [
  {
    year: 2023,
    total: 200000
  },
  {
    year: 2024,
    total: 100000
  },
  {
    year: 2025,
    total: 500000
  }
];

@Injectable({
  providedIn: 'root'
})
export class BudgetPlanService {
  readonly DEFAULT_AVAILABLE_PERCENT = 10;

  budgetPlan: BudgetPlan = {
    year: 0,
    total: 0,
    available: 0,
    used: 0
  };

  balance = 0;

  constructor() {
    const year = new Date().getFullYear();
    const yearBudget = YEAR_BUDGETS.find((v) => v.year === year);
    this.budgetPlan = { ...this.budgetPlan, ...yearBudget };
    console.log(BudgetPlanService.name, 'constructor', this.budgetPlan)
  }

  updateAvailable(percent: number) {
    const available = this.budgetPlan.total - (this.budgetPlan.total * percent) / 100;
    this.budgetPlan = { ...this.budgetPlan, available };
    this.balance = this.budgetPlan.available - this.budgetPlan.used;
    console.log(BudgetPlanService.name, 'updateBaseUsed', this.budgetPlan)
  }
}