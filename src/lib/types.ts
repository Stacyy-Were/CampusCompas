export type Institution = {
  id: string;
  name: string;
  type: string;
  county: string;
  location: string;
  fee_min: number;
  fee_max: number;
  facilities: string[];
  description: string | null;
  image_url: string | null;
  verified: boolean;
  created_at: string;
};

export type School = {
  id: string;
  owner_id: string;
  name: string;
  contact_email: string;
  type: string;
  county: string;
  location: string;
  fee_min: number;
  fee_max: number;
  facilities: string[];
  description: string | null;
  license_file_path: string | null;
  fee_structure_file_path: string | null;
  status: "pending" | "approved" | "rejected";
  institution_id: string | null;
  created_at: string;
};
