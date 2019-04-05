import { ICommandSender } from "cqrs-lite";
import { IEmployeeRepository } from "../../domain-layer/read-model/repositories/employee-repository";
import { EmployeeRM } from "../../domain-layer/read-model/employee-rm";

export class EmployeeController {

    constructor(private employeeRepository: IEmployeeRepository) {
    }

    async getByID(req: any, res: any) {

        try {
            let id: any = req.body.employeeID;
            let employee: EmployeeRM = await this.employeeRepository.getByID(id);
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
            let employees: EmployeeRM[] = await this.employeeRepository.getAll();
            res.send(employees);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}