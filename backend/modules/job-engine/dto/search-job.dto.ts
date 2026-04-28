export interface SearchJobDto {
  query?: string;
  location?: string;
  skills?: string;
  type?: string;
  minExperience?: number;
  maxExperience?: number;
  tenantId?: string;
}
