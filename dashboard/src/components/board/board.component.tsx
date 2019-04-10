import React, { Fragment } from 'react';

import '../styles.css';
import './board.component.css';
import { Employees } from '../employees/employees.component';
import { EmployeeDetails } from '../employees/employee-details/employee-details.component';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import { History, createBrowserHistory } from 'history';
import { InitializerService } from '../../services/initializer.service';
import { Locations } from '../locations/locations.component';
import { LocationDetails } from '../locations/location-details/location-details.component';
import { Button, Tooltip } from '@material-ui/core';

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

  render() {
    return (
      <div className="board">
        <div className="board-row row-up">
          <BrowserRouter>
            <div className="main-options">
              <div className="init">
                <Tooltip title="Initialize the System with some data (not mandatory)">
                  <Button className="button-ui" variant="contained" color="primary" onClick={this.onInit}>Initialize</Button>
                </Tooltip>
              </div>
              <div className="main-routes">
                <NavLink className="link" to='/locations' activeClassName="is-active">Locations</NavLink>
                <NavLink className="link" to='/employees' activeClassName="is-active">Employees</NavLink>
              </div>
            </div>
            <Switch>
              <Fragment>
                <div className="main-content">
                  <Route exact path="/locations" component={Locations} history={this.state.history} />
                  <Route exact path="/locations/details" component={LocationDetails} history={this.state.history} />
                  <Route exact path="/employees" component={Employees} history={this.state.history} />
                  <Route exact path="/employees/details" component={EmployeeDetails} history={this.state.history} />
                </div>
              </Fragment>
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}
