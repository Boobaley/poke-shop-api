export interface IUpdatedCart {
  readonly cartState: {
    readonly quantity: number;
    readonly totalPrice: number;
  };
  readonly updatedItem: {
    readonly id: number;
    readonly quantity: number;
    readonly price: number;
    readonly name: string;
    readonly image?: string;
  };
}
