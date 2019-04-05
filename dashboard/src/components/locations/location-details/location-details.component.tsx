import React, { RefObject } from 'react';
import { History } from 'history';

import './location-details.component.css';
import { LocationService } from '../../../services/location.service';
import { Location } from '../../../models/location';

type props = {
  history: History<any>,
  onClick?: any
};
export class LocationDetails extends React.Component<props> {

  locationService: LocationService;

  cityInput: RefObject<HTMLInputElement>;
  streetAddressInput: RefObject<HTMLInputElement>;
  stateInput: RefObject<HTMLInputElement>;
  postalCodeInput: RefObject<HTMLInputElement>;
  locationIDInput: RefObject<HTMLInputElement>;

  constructor(props: Readonly<props>) {
    super(props);

    this.locationService = new LocationService();

    this.cityInput = React.createRef();
    this.streetAddressInput = React.createRef();
    this.stateInput = React.createRef();
    this.postalCodeInput = React.createRef();
    this.locationIDInput = React.createRef();
  }

  onBack = () => {
    this.props.history.goBack();
  }

  onSave = () => {

    let location: Location = {
      city: this.cityInput.current.value,
      streetAddress: this.streetAddressInput.current.value,
      state: this.stateInput.current.value,
      postalCode: this.postalCodeInput.current.value,
      locationID: this.locationIDInput.current.value
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
      <div className="location-details">
        <div className="location-aligner">
          <div className="details-row">
            <label>City</label>
            <input type="text" ref={this.cityInput}></input>
          </div>
          <div className="details-row">
            <label>Street Address</label>
            <input type="text" ref={this.streetAddressInput}></input>
          </div>
          <div className="details-row">
            <label>State</label>
            <input type="text" ref={this.stateInput}></input>
          </div>
          <div className="details-row">
            <label>Postal Code</label>
            <input type="text" ref={this.postalCodeInput}></input>
          </div>
          <div className="details-row">
            <label>Location ID</label>
            <input type="text" ref={this.locationIDInput}></input>
          </div>
          <button onClick={this.onSave}>Save</button>
          <button onClick={this.onBack}>Back</button>
        </div>
      </div>
    );
  }
}
