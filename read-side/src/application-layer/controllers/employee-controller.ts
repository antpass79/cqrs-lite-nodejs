import { IEmployeeRepository, EmployeeM } from "cqrs-lite-common";

export class EmployeeController {

    constructor(private employeeRepository: IEmployeeRepository) {
    }

    async getByID(req: any, res: any) {

        try {
            let id: any = req.body.employeeID;
            let employee: EmployeeM = await this.employeeRepository.getByID(id);
            if (employee)
                res.send(employee);
            else
                res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async getAll(req: any, res: any) {

        try {
            let employees: EmployeeM[] = await this.employeeRepository.getAll();
            res.send(employees);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}