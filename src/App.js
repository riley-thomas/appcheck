import React, { Component }  from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import ErrorPage from './Errors/ErrorPage';
import Head from './Head/Head';
import Footer from './Footer/Footer';
import LookupPage from './Lookup/LookupPage';

class App extends Component {

  renderPage() {
    return (
      <div className="mb-5">
        <Switch>
          <Route exact path="/" render={ (r) =>
            <div> 
              <LookupPage route={r}/>
            </div>
          } />
          <Route component={ErrorPage} />
        </Switch>
      </div>
    );
  }


  render() {

    return (
      <div>
        <Head />
        {this.renderPage()}
        <Footer />
      </div>
    );
  }
}

export default App;
