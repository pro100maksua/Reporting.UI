export interface NewPublication {
  typeId: number;
  title: string;
  publicationNumber: string;
  publicationTitle: string;
  publicationYear: number;
  pagesCount: number;
  printedPagesCount: number;
  scopusAuthors: string;
  doi: string;
  publisher: string;
  isbn: string;
  contentType: string;
  abstract: string;
  articleNumber: string;
  pdfUrl: string;
  htmlUrl: string;
  conferenceLocation: string;
  citingPaperCount?: number;
  citingPatentCount?: number;
}
