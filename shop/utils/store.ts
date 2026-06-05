export type PickupBranchId = 'norwood';

export const PICKUP_BRANCHES: Record<
  PickupBranchId,
  {
    label: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  }
> = {
  norwood: {
    label: 'Norwood',
    address: 'Norwood, Johannesburg',
    city: 'Johannesburg',
    state: 'Gauteng',
    postcode: '',
    country: 'ZA',
  },
};
