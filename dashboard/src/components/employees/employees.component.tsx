import React from 'react';
import { History } from 'history';
import { EmployeeList } from './employee-list/employee-list.component';

import './employees.component.css';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { Button } from '@material-ui/core';

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

    updateEmployees = (employees: Employee[]) => {
        this.setState((state) => {
            return {
                employees
            };
        });
    }

    onRefresh = () => {
        this.setBusy(true);

        this._employeeService.getAll().then((data) => {
            return data.json()
                .then((employees: Employee[]) => {
                    this.updateEmployees(employees);
                })
                .catch((error) => {
                    this.updateEmployees([]);
                    alert('Error during locations request');
                })
                .finally(() => {
                    this.setBusy(false);
                });
        });
    }

    onCreate = () => {
        this.props.history.push('/employees/details');
    }

    renderEmployeeList() {
        return <EmployeeList employees={this.state.employees} />;
    }

    render() {
        return (
            <div className="employees">
                <div className="options">
                    <Button className="button-ui" variant="contained" color="primary" onClick={this.onRefresh}>Refresh</Button>
                    <Button className="button-ui" variant="contained" color="primary" onClick={this.onCreate}>Create</Button>
                </div>
                {this.state.loading ? <img className="spinner" src="/assets/images/loading.gif" /> : this.renderEmployeeList()}
            </div>
        );
    }
}

