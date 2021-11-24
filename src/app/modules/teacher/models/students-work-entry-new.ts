export interface NewStudentsWorkEntry {
  name?: string;
  group?: string;
  specialty?: string;
  place?: number;
  scientificWorkName?: string;
  independently?: boolean;

  typeId: number;
  scientificWorkTypeId?: number;
}
