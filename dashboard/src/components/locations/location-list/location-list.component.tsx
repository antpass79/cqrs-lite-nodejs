import React, { RefObject } from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";

import './location-list.component.css';
import { Location } from '../../../models/location';
import { Fab } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

type props = {
    onChangeLocation?: any,
    onRemoveLocation?: any,
    locations: Array<Location>
};
export class LocationList extends React.Component<props> {

    locationInput: RefObject<HTMLInputElement>;

    constructor(props: Readonly<props>) {
        super(props);

        this.locationInput = React.createRef();
    }

    onModifyLocation = (location: Location) => () => {
        alert('TODO');
    }

    onRemoveLocation = (location: Location) => () => {
        alert('TODO');
    }

    render() {

        const config = {
            showPagination: false,
            sortable: false
        };

        const columns = [
            {
                Header: 'City',
                accessor: 'city',
                Cell: (props: any) => <span>{props.value}</span>
            },
            {
                Header: 'Street Address',
                accessor: 'streetAddress',
                Cell: (props: any) => <span>{props.value}</span>
            },
            {
                Header: 'State',
                accessor: 'state',
                Cell: (props: any) => <span>{props.value}</span>
            },
            {
                Header: 'Postal Code',
                accessor: 'postalCode',
                Cell: (props: any) => <span>{props.value}</span>
            },
            {
                Header: 'Location ID',
                accessor: 'locationID',
                Cell: (props: any) => <span>{props.value}</span>
            },
            {
                Header: '',
                Cell: (props: any) => (
                    <Fab color="primary" aria-label="Add" onClick={this.onModifyLocation(props.original)}>
                        <EditIcon />
                    </Fab>
                )
            },
            {
                Header: '',
                Cell: (props: any) => (
                    <Fab color="primary" aria-label="Add" onClick={this.onRemoveLocation(props.original)}>
                        <DeleteIcon />
                    </Fab>
                )
            }
        ]
        const data = this.props.locations;

        return (
            <ReactTable data={data} columns={columns} showPagination={config.showPagination} sortable={config.sortable} className="location-table -striped -highlight" />
        );
    }
}
