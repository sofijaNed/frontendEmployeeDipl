export type Salary = {
  salaryAmount: number,
  paymentDate: Date
  salaryCPK: SalaryEmployee
}


export type SalaryEmployee = {
  salaryID: number,
  employeeID: number
}
