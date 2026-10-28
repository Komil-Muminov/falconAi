export interface IEmployee {
  id: string;
  name: string;
  position: string;
  department: string;
  createdAt: string;
}

export interface IEmployeeDbRow {
  id: string;
  name: string;
  position: string;
  department: string;
  created_at: string;
}

export interface ICreateEmployeeDto {
  name: string;
  position: string;
  department: string;
}
