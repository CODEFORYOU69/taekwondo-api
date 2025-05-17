import { CountryCode } from "@prisma/client";

export class CreateCompetitionDto {
  name!: string;
  hostCity!: string;
  hostCountry!: CountryCode;
  location!: string;
  startDate!: Date;
  endDate!: Date;
  dateFormat?: string;
  discipline?: string;
  grade?: string;
  isWT?: boolean;
  isPublic?: boolean;
  organizerId!: string;
}

export class UpdateCompetitionDto {
  name?: string;
  hostCity?: string;
  hostCountry?: CountryCode;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  dateFormat?: string;
  discipline?: string;
  grade?: string;
  isWT?: boolean;
  isPublic?: boolean;
}
