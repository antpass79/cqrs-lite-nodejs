import { EmployeeM } from "../employee-m";
import { RedisRepository } from "./redis-repository";
import { IBaseRepository } from "./base-repository";

export interface IEmployeeRepository extends IBaseRepository<EmployeeM>
{
    getAll(): Promise<EmployeeM[]>;
}

export class EmployeeRepository extends RedisRepository implements IEmployeeRepository
{
    constructor() {
        super("employee");
    }

    async getByID(employeeID: number): Promise<EmployeeM> {
        return this.get<EmployeeM>(employeeID);
    }

    async getMultiple(employeeIDs: number[]): Promise<EmployeeM[]> {
        return super.getMultipleBase<EmployeeM>(employeeIDs);
    }

    async getAll(): Promise<EmployeeM[]> {
        return super.get<EmployeeM[]>("all");
    }

    async save(employee: EmployeeM): Promise<boolean> {

        let promises: Promise<any>[] = [super.saveBase(employee.employeeID, employee), this.mergeIntoAllCollection(employee)];
        await Promise.all(promises);
        console.log(`EmployeeRepository.save -> saveBase employee AggregateID ${employee.aggregateID}, ${employee.lastName}, ${employee.firstName}`);
        return Promise.resolve(true);
    }

    private async mergeIntoAllCollection(employee: EmployeeM): Promise<boolean> {
        let allEmployees: EmployeeM[] = [];
        if (await this.exists("all")) {
            allEmployees = await super.get<EmployeeM[]>("all");
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