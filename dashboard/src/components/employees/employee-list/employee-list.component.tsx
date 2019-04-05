import React, { RefObject } from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";

import './employee-list.component.css';
import { Employee } from '../../../models/employee';

type props = {
    onChangeEmployee?: any,
    onRemoveEmployee?: any,    
    employees: Array<Employee>
};
export class EmployeeList extends React.Component<props> {

    employeeInput: RefObject<HTMLInputElement>;

    constructor(props: Readonly<props>) {
        super(props);

        this.employeeInput = React.createRef();
    }

    onModifyEmployee = (employee: Employee) => () => {
        alert('TODO');
        // let updatedEmployee: Employee = {
        //     firstName: employee.firstName,
        //     lastName: employee.lastName,
        //     jobTitle: employee.jobTitle,
        //     dateOfBirth
        // };

        // this.props.onChangeEmployee(updatedEmployee);
    }

    onRemoveEmployee = (employee: Employee) => () => {
        alert('TODO');
        // this.props.onRemoveEmployee(employee);
    }

    render() {

        const config = {
            showPagination: false,
            sortable: false
        };

        const columns = [
            {
                Header: 'Last Name',
                accessor: 'lastName',
                Cell: (props: any) => <span>{props.value}</span> 
            },
            {
                Header: 'First Name',
                accessor: 'firstName',
                Cell: (props: any) => <span>{props.value}</span> 
            },
            {
                Header: 'Job Title',
                accessor: 'jobTitle',
                Cell: (props: any) => <span>{props.value}</span> 
            },
            {
                Header: '',
                Cell: (props: any) => <button onClick={this.onModifyEmployee(props.original)}>Modify</button>
            },
            {
                Header: '',
                Cell: (props: any) => <button onClick={this.onRemoveEmployee(props.original)}>Remove</button>
            }
        ]
        const data = this.props.employees;        

        return (
            <ReactTable data={data} columns={columns} showPagination={config.showPagination} sortable={config.sortable} className="employee-table -striped -highlight" />
        );
    }
}
