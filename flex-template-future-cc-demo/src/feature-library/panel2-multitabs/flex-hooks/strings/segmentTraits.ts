export type KnownTrait = {
  key: string;
  label: string;
  display_value: boolean;
  variant: string;
  onlyIfTrue?: boolean;
};

export const KnownTraits: KnownTrait[] = [
  {
    key: 'account_type',
    label: 'Account Type',
    display_value: true,
    variant: 'info',
  },
  {
    key: 'pageUserIsOn',
    label: 'User is on page',
    display_value: true,
    variant: 'success',
  },
  {
    key: 'ownr_ocpd_hm_lon_cstmr_ind',
    label: 'Owner Occupied Home Loan',
    display_value: false,
    variant: 'error',
    onlyIfTrue: true,
  },
  {
    key: 'private_bank_prospects',
    label: 'Private Banking Prospect',
    display_value: false,
    variant: 'error',
    onlyIfTrue: true,
  },
  {
    key: 'prsnl_bnkng_cstmr_ind',
    label: 'Personalised Banking Customer',
    display_value: false,
    variant: 'error',
    onlyIfTrue: true,
  },
  {
    key: 'prvt_bnkng_cstmr_ind',
    label: 'Private Banking Customer',
    display_value: false,
    variant: 'error',
    onlyIfTrue: true,
  },

  {
    key: 'invst_hm_lon_cstmr_ind',
    label: 'Investment Homeloan Customer',
    display_value: false,
    variant: 'error',
    onlyIfTrue: true,
  },
  {
    key: 'website_leads',
    label: 'Website Lead',
    display_value: false,
    variant: 'new',
  },
  {
    key: 'enterprise_id',
    label: 'Enterprise ID',
    display_value: true,
    variant: 'new',
  },
  {
    key: 'account_id',
    label: 'Account ID',
    display_value: true,
    variant: 'new',
  },
  {
    key: 'lead_id',
    label: 'Lead ID',
    display_value: true,
    variant: 'new',
  },
  {
    key: 'animal',
    label: 'Animal',
    display_value: true,
    variant: 'new',
  },
  {
    key: 'favourite_colour',
    label: 'Colour',
    display_value: true,
    variant: 'info',
  },
  {
    key: 'music_preference',
    label: 'Music',
    display_value: true,
    variant: 'error',
  },
  {
    key: 'current_offer',
    label: 'Current Offer',
    display_value: true,
    variant: 'new',
  },
  {
    key: 'postcode',
    label: 'Post Code',
    display_value: true,
    variant: 'success',
  },
  {
    key: 'destination_preference',
    label: 'Destination Preference',
    display_value: true,
    variant: 'success',
  },
];
