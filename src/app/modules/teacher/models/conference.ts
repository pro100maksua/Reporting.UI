export interface Conference {
  id: number;
  title: string;
  number?: string;
  year: number;
  location: string;
  organizers?: string;
  coOrganizers?: string;
  startDate?: string;
  endDate?: string;
  numberOfParticipants?: number;

  typeId: number;
  typeName: string;
  typeValue: number;

  subTypeId?: number;
  subTypeName?: string;
  subTypeValue?: number;
}
