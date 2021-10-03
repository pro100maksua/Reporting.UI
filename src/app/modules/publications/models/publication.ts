import { Author } from "./author";

export interface Publication {
  title: string;
  publicationTitle: string;
  publicationYear: number;
  startPage: string;
  endPage: string;
  pagesCount: number;
  printedPagesCount?: number;
  authors: Author[];
}
