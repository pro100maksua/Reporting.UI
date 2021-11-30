import { TuiDay } from "@taiga-ui/cdk";

export interface NewDissertation {
  authorName: string;
  placeOfWork: string;
  supervisor: string;
  specialty: string;
  topic: string;
  deadline?: string;
  defenseDate: TuiDay;
  defensePlace: string;
  diplomaReceiptDate?: TuiDay;
}
