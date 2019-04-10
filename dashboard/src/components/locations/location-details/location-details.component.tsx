import React from 'react';
import { FormControl } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import '../../styles.css';

import { History } from 'history';

import { LocationService } from '../../../services/location.service';
import { Location } from '../../../models/location';

type state = {
  city: string,
  streetAddress: string,
  state: string,
  postalCode: string,
  locationID?: any
};
type props = {
  history: History<any>,
  onClick?: any
};
export class LocationDetails extends React.Component<props, state> {

  locationService: LocationService;

  constructor(props: Readonly<props>) {
    super(props);

    this.locationService = new LocationService();

    this.state = {
      city: '',
      streetAddress: '',
      state: '',
      postalCode: ''
    };
  }

  onBack = () => {
    this.props.history.goBack();
  }

  onSave = () => {

    let location: Location = {
      city: this.state.city,
      streetAddress: this.state.streetAddress,
      state: this.state.state,
      postalCode: this.state.postalCode,
      locationID: this.state.locationID
    };

    this.locationService.create(location).then((response: Response) => {
      if (response.ok)
        alert('Create successful');
      else
        alert('Create failed');
    });
  }

  render() {
    return (
      <form className="form-root">
        <FormControl className="form-control">
          <TextField
            id="city"
            label="city"
            className="textfield-ui"
            value={this.state.city}
            onChange={e => this.setState({ city: e.target.value })}
            margin="normal"
          />
        </FormControl>
        <FormControl className="form-control">
          <TextField
            id="street-address"
            label="Street Address"
            className="textfield-ui"
            value={this.state.streetAddress}
            onChange={e => this.setState({ streetAddress: e.target.value })}
            margin="normal"
          />
        </FormControl>
        <FormControl className="form-control">
          <TextField
            id="state"
            label="State"
            className="textfield-ui"
            value={this.state.state}
            onChange={e => this.setState({ state: e.target.value })}
            margin="normal"
          />
        </FormControl>
        <FormControl className="form-control">
          <TextField
            id="postal-code"
            label="Postal Code"
            className="textfield-ui"
            value={this.state.postalCode}
            onChange={e => this.setState({ postalCode: e.target.value })}
            margin="normal"
          />
        </FormControl>
        <FormControl className="form-control">
          <TextField
            id="location-id"
            label="Location ID"
            className="textfield-ui"
            value={this.state.locationID}
            onChange={e => this.setState({ locationID: e.target.value })}
            margin="normal"
          />
        </FormControl>
        <Button className="button-ui" variant="contained" color="primary" onClick={this.onSave}>Save</Button>
        <Button className="button-ui" variant="contained" color="primary" onClick={this.onBack}>Back</Button>
      </form>
    );
  }
}
