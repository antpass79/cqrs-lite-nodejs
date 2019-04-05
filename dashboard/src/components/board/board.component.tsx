import React from 'react';

import './board.component.css';
import { Employees } from '../employees/employees.component';
import { EmployeeDetails } from '../employees/employee-details/employee-details.component';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { History, createBrowserHistory } from 'history';
import { InitializerService } from '../../services/initializer.service';
import { Locations } from '../locations/locations.component';
import { LocationDetails } from '../locations/location-details/location-details.component';

type state = {
  history: History<any>
}
type props = {
  squares?: number[],
  onClick?: any
};
export class Board extends React.Component<props, state> {

  private _initializerService: InitializerService = new InitializerService();

  constructor(props: Readonly<props>) {
    super(props);

    this.state = {
      history: createBrowserHistory()
    };
  }

  onInit = () => {

    this._initializerService.init().then((response: Response) => {
      if (response.ok)
        alert('Init successul');
      else
        alert('Init failed');
    });
  }

  renderEmployees() {
    return <Employees history={this.state.history} />;
  }

  renderEmployeeDetails() {
    return <EmployeeDetails history={this.state.history} />;
  }

  render() {

    return (
      <div className="board">
        <button className="init" onClick={this.onInit}>Initialize System with some data (not mandatory)</button>
        <div className="board-row row-up">
          <BrowserRouter>
            <div className="options">
              <Link className="link" to='/employees'>Employees</Link>
              <Link className="link" to='/locations'>Locations</Link>
            </div>
            <Switch>
              <Route exact path="/employees" component={Employees} history={this.state.history} />
              <Route exact path="/employees/details" component={EmployeeDetails} history={this.state.history} />
              <Route exact path="/locations" component={Locations} history={this.state.history} />
              <Route exact path="/locations/details" component={LocationDetails} history={this.state.history} />
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}
