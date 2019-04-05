import { EmployeeRM } from "../employee-rm";
import { RedisRepository } from "./redis-repository";
import { IBaseRepository } from "./base-repository";

export interface IEmployeeRepository extends IBaseRepository<EmployeeRM>
{
    getAll(): Promise<EmployeeRM[]>;
}

export class EmployeeRepository extends RedisRepository implements IEmployeeRepository
{
    constructor() {
        super("employee");
    }

    async getByID(employeeID: number): Promise<EmployeeRM> {
        return this.get<EmployeeRM>(employeeID);
    }

    async getMultiple(employeeIDs: number[]): Promise<EmployeeRM[]> {
        return super.getMultipleBase<EmployeeRM>(employeeIDs);
    }

    async getAll(): Promise<EmployeeRM[]> {
        return super.get<EmployeeRM[]>("all");
    }

    async save(employee: EmployeeRM): Promise<boolean> {
        let result = await super.saveBase(employee.employeeID, employee);
        console.log('EmployeeRepository.save -> saveBase of employeeAggregateID ${employee.aggregateID} is ${result}');
        return this.mergeIntoAllCollection(employee);
    }

    private async mergeIntoAllCollection(employee: EmployeeRM): Promise<boolean> {
        let allEmployees: EmployeeRM[] = [];
        if (await this.exists("all")) {
            allEmployees = await super.get<EmployeeRM[]>("all");
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