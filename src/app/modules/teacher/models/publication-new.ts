export interface NewPublication {
  title: string;
  publicationTitle: string;
  publicationYear: number;
  pagesCount: number;
  printedPagesCount?: number;
  authors: string[];
}
