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
          <Redirect exact from="/" to="/en" />
          <Route exact path="/:language(en|es)" render={ (r) =>
            <div> 
              <LookupPage route={r} language={r.match.params.language} />
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
