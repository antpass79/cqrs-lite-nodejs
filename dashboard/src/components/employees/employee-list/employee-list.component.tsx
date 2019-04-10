import React, { RefObject } from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";

import './employee-list.component.css';
import { Employee } from '../../../models/employee';
import { Fab } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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
    }

    onRemoveEmployee = (employee: Employee) => () => {
        alert('TODO');
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
                Cell: (props: any) => (
                    <Fab color="primary" aria-label="Add" onClick={this.onModifyEmployee(props.original)}>
                        <EditIcon />
                    </Fab>
                )
            },
            {
                Header: '',
                Cell: (props: any) => (
                    <Fab color="primary" aria-label="Add" onClick={this.onRemoveEmployee(props.original)}>
                        <DeleteIcon />
                    </Fab>
                )
            }
        ]
        const data = this.props.employees;        

        return (
            <ReactTable data={data} columns={columns} showPagination={config.showPagination} sortable={config.sortable} className="employee-table -striped -highlight" />
        );
    }
}
