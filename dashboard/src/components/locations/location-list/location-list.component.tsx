import React, { RefObject } from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";

import './location-list.component.css';
import { Location } from '../../../models/location';

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
        // let updatedLocation: Location = {
        //     locationID: location.locationID,
        //     city: location.city,
        //     streetAddress: location.streetAddress,
        //     state: location.state,
        //     postalCode: location.postalCode,
        // };

        // this.props.onChangeLocation(updatedLocation);
    }

    onRemoveLocation = (location: Location) => () => {
        alert('TODO');
        // this.props.onRemoveLocation(location);
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
                Header: '',
                Cell: (props: any) => <button onClick={this.onModifyLocation(props.original)}>Modify</button>
            },
            {
                Header: '',
                Cell: (props: any) => <button onClick={this.onRemoveLocation(props.original)}>Remove</button>
            }
        ]
        const data = this.props.locations;

        return (
            <ReactTable data={data} columns={columns} showPagination={config.showPagination} sortable={config.sortable} className="location-table -striped -highlight" />
        );
    }
}
