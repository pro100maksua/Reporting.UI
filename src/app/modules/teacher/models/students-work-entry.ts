export interface StudentsWorkEntry {
  id: number;
  entryName: string;
  name?: string;
  group?: string;
  specialty?: string;
  place?: number;
  scientificWorkName?: string;
  independently: boolean;
  year: number;

  typeId: number;
  typeName: string;
  typeValue: number;

  scientificWorkTypeId?: number;
  scientificWorkTypeName?: string;
  scientificWorkTypeValue?: number;
}
