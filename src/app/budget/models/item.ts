export enum ItemStatus {
  PENDING = 'PENDING', APPROVED = 'APPROVED', REJECTED = 'REJECTED'
}


export type CreateItem = Omit<Item, "id">

export type EditIem = CreateItem

// "owner": {
//             "id": 6,
//             "username": "kirato"
//         },
export interface ItemUserRelation {
  id: number;
  username: string;
}
export interface Item {
  id: number;
  title: string;
  amount: number;
  quantity: number;
  status: ItemStatus;
  owner_id: number;
  owner: ItemUserRelation;
  approver_id: number | null;
  approver: ItemUserRelation | null
  created_at: Date;
  updated_status_at: Date;
}
