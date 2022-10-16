export interface IOrderItem {
  readonly id: number;
  readonly name: string;
  readonly image?: string;
  quantity: number;
  readonly price: number;
}
