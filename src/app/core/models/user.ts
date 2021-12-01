export interface User {
  id: number;
  name: string;
  degree: string;
  academicStatus: string;
  position: string;
  email: string;
  scopusAuthorName: string;
  departmentId: string;
  departmentName: string;
  roles: number[];
  ieeeXploreAuthorName?: string;
}
