import { EmployeeWM } from "../employee-wm";
import { RedisRepository } from "./redis-repository";
import { IBaseRepository } from "./base-repository";

export interface IEmployeeRepository extends IBaseRepository<EmployeeWM>
{
    getAll(): Promise<EmployeeWM[]>;
}

export class EmployeeRepository extends RedisRepository implements IEmployeeRepository
{
    constructor() {
        super("employee");
    }

    async getByID(employeeID: number): Promise<EmployeeWM> {
        return this.get<EmployeeWM>(employeeID);
    }

    async getMultiple(employeeIDs: number[]): Promise<EmployeeWM[]> {
        return super.getMultipleBase<EmployeeWM>(employeeIDs);
    }

    async getAll(): Promise<EmployeeWM[]> {
        return super.get<EmployeeWM[]>("all");
    }

    async save(employee: EmployeeWM): Promise<boolean> {
        let result = await super.saveBase(employee.employeeID, employee);
        console.log(`EmployeeRepository.save -> saveBase of employee.AggregateID ${employee.aggregateID} is ${result}`);
        return this.mergeIntoAllCollection(employee);
    }

    private async mergeIntoAllCollection(employee: EmployeeWM): Promise<boolean> {
        let allEmployees: EmployeeWM[] = [];
        if (await this.exists("all")) {
            allEmployees = await super.get<EmployeeWM[]>("all");
        }

        //If the district already exists in the ALL collection, remove that entry
        if (allEmployees.filter(x => x.employeeID == employee.employeeID).length > 0) {
            let employeeToRemove = allEmployees.find(x => x.employeeID == employee.employeeID);
            allEmployees.splice(allEmployees.indexOf(employeeToRemove), 1);
        }

        //Add the modified district to the ALL collection
        allEmployees.push(employee);

        return super.saveBase("all", allEmployees);
    }
}