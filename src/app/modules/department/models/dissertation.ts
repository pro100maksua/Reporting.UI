export interface Dissertation {
  id: number;
  authorId?: number;
  authorName?: string;
  placeOfWork: string;
  supervisor: string;
  specialty: string;
  topic: string;
  deadline?: string;
  defenseDate: string;
  defensePlace: string;
  diplomaReceiptDate?: string;
}
