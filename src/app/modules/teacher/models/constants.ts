export const PUBLICATION_TYPES = {
  scopus: 8,
} as const;

export const STUDENTS_WORK_TYPES = {
  participationInScientificWork: 1,
  participationInCompetitions: 2,
  receivedAwardsForTheResultsOfThe2ndRound: 3,
  participationInScientificConferences: 4,
  participationInCompetitionsOfScientificWorksReceivedAwards: 5,
  participationInCompetitionsOfDiplomaAndMastersReceivedAwards: 6,
  publishedArticleAbstracts: 7,
} as const;

export const STUDENTS_SCIENTIFIC_WORK_TYPES = {
  theoreticalSeminar: 1,
  scienceClub: 2,
  problemGroup: 3,
  otherForm: 4,
} as const;
