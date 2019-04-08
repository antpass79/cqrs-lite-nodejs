import React from 'react';
import { History } from 'history';
import { LocationList } from './location-list/location-list.component';

import './locations.component.css';
import { Location } from '../../models/location';
import { LocationService } from '../../services/location.service';
import { SocketClientService } from '../../services/socket-client.service';

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

    onRefresh = () => {
        this.setBusy(true);

        this._locationService.getAll().then((data) => {
            return data.json()
                .then((locations: Location[]) => {
                    this.setState(state => {
                        return {
                            locations
                        };
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.setState(state => {
                        const locations: Location[] = [];
                        return {
                            locations
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
                    const locations: Location[] = [];
                    return {
                        locations
                    };
                });
            })
            .finally(() => {
                this.setBusy(false);
            });
    }

    onCreate = () => {
        this.props.history.push('/locations/details');
    }

    renderLocationList() {
        return <LocationList locations={this.state.locations} />;
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className="locations">
                    <div className="options">
                        <button onClick={this.onRefresh}>Refresh</button>
                        <button onClick={this.onCreate}>Create</button>
                    </div>
                    {this.renderLocationList()}
                </div>
            );
        }

        return (
            <img className="spinner" src="/assets/images/loading.gif" />
        );
    }
}
