export interface Lead {
  id: string;
  phone_number: string;
  executive_first_name: string;
  address: string;
  company_name: string;
  disposition: 'pending' | 'interested' | 'not_interested' | 'unavailable' | 'corporate';
  notes: string;
  created_at: string;
  updated_at: string;
}

export type DispositionType = Lead['disposition'];
