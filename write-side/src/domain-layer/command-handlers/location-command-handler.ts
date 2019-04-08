import { ICommandHandler, ISession } from "cqrs-lite";
import { CreateLocationCommand } from "../commands/create-location-command";
import { AssignEmployeeToLocationCommand } from "../commands/assign-employee-to-location-command";
import { RemoveEmployeeFromLocationCommand } from "../commands/remove-employee-from-location-command";
import { Location } from "../write-model/location";

export class LocationCommandHandler implements
    ICommandHandler<CreateLocationCommand>,
    ICommandHandler<AssignEmployeeToLocationCommand>,
    ICommandHandler<RemoveEmployeeFromLocationCommand>
{
    private readonly _session: ISession;

    constructor(session: ISession) {
        this._session = session;
    }

    handle(command: CreateLocationCommand | AssignEmployeeToLocationCommand | RemoveEmployeeFromLocationCommand): void {
        if (command instanceof CreateLocationCommand) {
            let location: Location = new Location(command.id, command.locationID, command.streetAddress, command.city, command.state, command.postalCode);
            this._session.add(location);
        }
        else if (command instanceof AssignEmployeeToLocationCommand) {
            let location = this._session.get<Location>(Location, command.id);
            location.addEmployee(command.employeeID);
        }
        else if (command instanceof RemoveEmployeeFromLocationCommand) {
            let location = this._session.get<Location>(Location, command.id);
            location.removeEmployee(command.employeeID);
        }

        this._session.commit();
    }
}