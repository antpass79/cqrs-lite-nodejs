import React from 'react';
import { History } from 'history';
import { LocationList } from './location-list/location-list.component';

import './locations.component.css';
import { Location } from '../../models/location';
import { LocationService } from '../../services/location.service';
import { SocketClientService } from '../../services/socket-client.service';
import { Button } from '@material-ui/core';

type state = {
    locations: Location[],
    loading: boolean
};
type props = {
    history: History<any>
};
export class Locations extends React.Component<props, state> {

    private _locationService: LocationService = new LocationService();

    constructor(props: Readonly<props>) {
        super(props);

        this.state = {
            locations: [],
            loading: false
        };
    }

    componentDidMount() {

        this.onRefresh();

        // let socketClientService = new SocketClientService('http://localhost:4005');
        // socketClientService.on('locationAdded', (location: Location) => {
        //     console.log('Location from socket:');
        //     console.log(location);

        //     this.setState(state => {
        //         const locations = [...state.locations, location];
        //         return {
        //             locations
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

    handleAddLocation = (location: Location) => {

        this.setBusy(true);

        this._locationService.create(location).then(() => {
        })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.setBusy(false);
            });
    }

    updateLocations = (locations: Location[]) => {
        this.setState((state) => {
            return {
                locations
            };
        });
    }

    onRefresh = () => {
        this.setBusy(true);

        this._locationService.getAll().then((data) => {
            return data.json()
                .then((locations: Location[]) => {
                    this.updateLocations(locations);
                })
                .catch((error) => {                    
                    this.updateLocations([]);
                    alert('Error during locations request');
                })
                .finally(() => {
                    this.setBusy(false);
                });
        });
    }

    onCreate = () => {
        this.props.history.push('/locations/details');
    }

    renderLocationList() {
        return <LocationList locations={this.state.locations} />;
    }

    render() {
        return (
            <div className="locations">
                <div className="options">
                    <Button className="button-ui" variant="contained" color="primary" onClick={this.onRefresh}>Refresh</Button>
                    <Button className="button-ui" variant="contained" color="primary" onClick={this.onCreate}>Create</Button>
                </div>
                {this.state.loading ? <img className="spinner" src="/assets/images/loading.gif" /> : this.renderLocationList()}
            </div>
        );
    }
}