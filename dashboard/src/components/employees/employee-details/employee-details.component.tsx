import React, { RefObject } from 'react';
import { FormControl, InputLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import '../../styles.css';

import { DateFormatInput } from 'material-ui-next-pickers';

import { History } from 'history';

import './employee-details.component.css';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee';
import { Location } from '../../../models/location';

import { LocationService } from '../../../services/location.service';

class LocationView {
  value: any;
  label: any;
}

type state = {
  locationViews: LocationView[],
  selectedLocationID: number,
  birthDate?: Date,
  lastName?: string,
  firstName?: string,
  jobTitle?: string,
  loading: boolean
};
type props = {
  history: History<any>,
  onClick?: any
};
export class EmployeeDetails extends React.Component<props, state> {

  employeeService: EmployeeService;
  locationService: LocationService;

  birthDateInput: RefObject<HTMLInputElement>;

  constructor(props: Readonly<props>) {
    super(props);

    this.employeeService = new EmployeeService();
    this.locationService = new LocationService();

    this.state = {
      birthDate: new Date(1978, 5, 3),
      selectedLocationID: -1,
      locationViews: [],
      loading: false
    };

    this.onRefreshLocation();
  }

  onRefreshLocation = () => {
    this.locationService.getAll().then((data) => {
      return data.json()
        .then((locations: Location[]) => {

          const locationViews = locations.map(location => {
            let locationview = new LocationView();
            locationview.value = location.locationID;
            locationview.label = location.city + ' ' + location.streetAddress;

            return locationview;
          });

          this.setState(state => {
            return {
              locationViews
            };
          });
        })
        .catch((error: any) => {
          console.log(error);
          const locationViews: LocationView[] = [];
          return {
            locationViews
          };
        });
    })
      .finally(() => {
        //this.setBusy(false);
      });
  }

  onBirthDateChange = (date: Date) => {
    this.setState({
      birthDate: date
    });
  }

  onBack = () => {
    this.props.history.goBack();
  }

  onSave = () => {

    let employee: Employee = {
      lastName: this.state.lastName,
      firstName: this.state.firstName,
      jobTitle: this.state.jobTitle,
      dateOfBirth: this.state.birthDate,
      locationID: this.state.selectedLocationID
    };

    this.employeeService.create(employee).then((response: Response) => {
      if (response.ok)
        alert('Create successful');
      else
        alert('Create failed');
    });
  }

  handleLocation = (event: any) => {
    let selectedLocation = this.state.locationViews.find(locationView => locationView.value == event.target.value);
    this.setState({ selectedLocationID: selectedLocation.value });
  }

  render() {

    return (
        <form className="form-root">
          <FormControl className="form-control">
            <TextField
              id="last-name"
              label="Last Name"
              className="textfield-ui"
              value={this.state.lastName}
              onChange={e => this.setState({ lastName: e.target.value })}
              margin="normal"
            />
          </FormControl>
          <FormControl className="form-control">
            <TextField
              id="first-name"
              label="First Name"
              className="textfield-ui"
              value={this.state.firstName}
              onChange={e => this.setState({ firstName: e.target.value })}
              margin="normal"
            />
          </FormControl>
          <FormControl className="form-control">
            <TextField
              id="job-title"
              label="Job Title"
              className="textfield-ui"
              value={this.state.jobTitle}
              onChange={e => this.setState({ jobTitle: e.target.value })}
              margin="normal"
            />
          </FormControl>
          <FormControl className="form-control">
          <DateFormatInput
            className="picker-ui"
            name='birth-date'
            value={this.state.birthDate}
            onChange={date => this.setState({ birthDate: date })} />
          </FormControl>
          <FormControl className="form-control">
            <InputLabel htmlFor="location">Location</InputLabel>
            <Select
              className="select-ui"
              inputProps={{
                name: 'location',
                id: 'location'
              }}
              value={this.state.selectedLocationID}
              onChange={this.handleLocation}>
              {this.state.locationViews.map((item, key) => {
                return <MenuItem key={key} value={item.value}>{item.label}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <Button className="button-ui" variant="contained" color="primary" onClick={this.onSave}>Save</Button>
          <Button className="button-ui" variant="contained" color="primary" onClick={this.onBack}>Back</Button>
        </form>
    );
  }
}