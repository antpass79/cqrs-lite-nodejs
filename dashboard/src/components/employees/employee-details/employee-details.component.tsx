import React, { RefObject } from 'react';
import { History } from 'history';

import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import './employee-details.component.css';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee';
import { Location } from '../../../models/location';

import { LocationService } from '../../../services/location.service';

class Option {
  value: any;
  label: any;
}

type state = {
  options: Option[],
  selectedOption?: Option,
  birthDate: Date,
  loading: boolean
};
type props = {
  history: History<any>,
  onClick?: any
};
export class EmployeeDetails extends React.Component<props, state> {

  employeeService: EmployeeService;
  locationService: LocationService;

  lastNameInput: RefObject<HTMLInputElement>;
  firstNameInput: RefObject<HTMLInputElement>;
  jobTitleInput: RefObject<HTMLInputElement>;
  birthDateInput: RefObject<HTMLInputElement>;

  constructor(props: Readonly<props>) {
    super(props);

    this.employeeService = new EmployeeService();
    this.locationService = new LocationService();

    this.state = {
      selectedOption: undefined,
      birthDate: new Date(),
      options: [],
      loading: false
  };

    this.onRefreshLocation();

    this.lastNameInput = React.createRef();
    this.firstNameInput = React.createRef();
    this.jobTitleInput = React.createRef();
  }

  onRefreshLocation = () => {
    this.locationService.getAll().then((data) => {
      return data.json()
        .then((locations: Location[]) => {

          const options = locations.map(location => {
            let option = new Option();
            option.value = location.locationID;
            option.label = location.city + ' ' + location.streetAddress;

            return option;
          });

          this.setState(state => {
            return {
              options
            };
          });
        })
        .catch((error: any) => {
          console.log(error);
          const options: Option[] = [];
          return {
            options
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

    console.log(`date selected:`, date);
  }

  onLocationChange = (selectedOption: any) => {
    this.setState({
      selectedOption: selectedOption
    });

    console.log(`Option selected:`, selectedOption);
  }

  onBack = () => {
    this.props.history.goBack();
  }

  onSave = () => {

    let employee: Employee = {
      lastName: this.lastNameInput.current.value,
      firstName: this.firstNameInput.current.value,
      jobTitle: this.jobTitleInput.current.value,
      dateOfBirth: this.state.birthDate,
      locationID: this.state.selectedOption.value ? this.state.selectedOption.value : undefined
    };

    this.employeeService.create(employee).then((response: Response) => {
      if (response.ok)
        alert('Create successful');
      else
        alert('Create failed');
    });
  }

  render() {

    const { selectedOption } = this.state;

    return (
      <div className="employee-details">
        <div className="employee-aligner">
          <div className="details-row">
            <label>Last Name</label>
            <input type="text" ref={this.lastNameInput}></input>
          </div>
          <div className="details-row">
            <label>First Name</label>
            <input type="text" ref={this.firstNameInput}></input>
          </div>
          <div className="details-row">
            <label>Job Title</label>
            <input type="text" ref={this.jobTitleInput}></input>
          </div>
          <div className="details-row">
            <label>Birth Date</label>
            <DatePicker
              selected={this.state.birthDate}
              onChange={this.onBirthDateChange}
            />
            </div>
          <div className="details-row">
            <label>Location</label>
            <Select className="select" value={selectedOption} options={this.state.options} onChange={this.onLocationChange}></Select>
          </div>
          <button onClick={this.onSave}>Save</button>
          <button onClick={this.onBack}>Back</button>
        </div>
      </div>
    );
  }
}
