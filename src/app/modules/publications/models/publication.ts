import { Author } from "./author";

export interface Publication {
  title: string;
  publicationTitle: string;
  publicationYear: number;
  startPage: string;
  endPage: string;
  pagesCount: number;
  printedPagesCount?: number;
  doi?: string;
  publisher?: string;
  isbn?: string;
  abstract?: string;
  articleNumber?: string;
  pdfUrl?: string;
  htmlUrl?: string;
  conferenceLocation?: string;
  citingPaperCount?: number;
  citingPatentCount?: number;
  authors: Author[];
}
