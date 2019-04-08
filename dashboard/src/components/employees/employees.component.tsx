import React from 'react';
import { History } from 'history';
import { EmployeeList } from './employee-list/employee-list.component';

import './employees.component.css';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { SocketClientService } from '../../services/socket-client.service';

type state = {
    employees: Employee[],
    loading: boolean
};
type props = {
    history: History<any>
};
export class Employees extends React.Component<props, state> {

    private _employeeService: EmployeeService = new EmployeeService();

    constructor(props: Readonly<props>) {
        super(props);

        this.state = {
            employees: [],
            loading: false
        };
    }

    componentDidMount() {

        this.onRefresh();

        // let socketClientService = new SocketClientService('http://localhost:4005');
        // socketClientService.on('employeeAdded', (employee: Employee) => {
        //     console.log('Employee from socket:');
        //     console.log(employee);

        //     this.setState(state => {
        //         const employees = [...state.employees, employee];
        //         return {
        //             employees
        //         };
        //     });
        // });
    }

    setBusy = (busy: boolean) => {

        this.setState(() => {
            const loading = busy;
            return {
                loading
            };
        });
    }

    handleAddEmployee = (employee: Employee) => {

        this.setBusy(true);

        this._employeeService.create(employee).then(() => {
        })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.setBusy(false);
            });
    }

    onRefresh = () => {
        this.setBusy(true);

        this._employeeService.getAll().then((data) => {
            return data.json()
                .then((employees: Employee[]) => {
                    this.setState(state => {
                        return {
                            employees
                        };
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.setState(state => {
                        const employees: Employee[] = [];
                        return {
                            employees
                        };
                    });
                })
                .finally(() => {
                    this.setBusy(false);
                });
        })
            .catch((error) => {
                console.log(error);
                this.setState(state => {
                    const employees: Employee[] = [];
                    return {
                        employees
                    };
                });
            })
            .finally(() => {
                this.setBusy(false);
            });
    }

    onCreate = () => {
        this.props.history.push('/employees/details');
    }

    renderEmployeeList() {
        return <EmployeeList employees={this.state.employees} />;
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className="employees">
                    <div className="options">
                        <button onClick={this.onRefresh}>Refresh</button>
                        <button onClick={this.onCreate}>Create</button>
                    </div>
                    {this.renderEmployeeList()}
                </div>
            );
        }

        return (
            <img className="spinner" src="/assets/images/loading.gif" />
        );
    }
}
