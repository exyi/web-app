import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';

import HeaderNotificationsContainer from '../../../containers/HeaderNotificationsContainer';
import HeaderSystemMessagesContainer from '../../../containers/HeaderSystemMessagesContainer';
import HeaderLanguageSwitching from '../HeaderLanguageSwitching';
import ClientOnly from '../../helpers/ClientOnly';
import { LoadingIcon } from '../../icons';
import withLinks from '../../../helpers/withLinks';

class Header extends Component {
  toggleSidebarSize = e => {
    e.preventDefault();
    this.props.toggleSidebarSize();
  };

  toggleSidebarVisibility = e => {
    e.preventDefault();
    this.props.toggleSidebarVisibility();
  };

  render() {
    const {
      isLoggedIn,
      availableLangs = [],
      currentLang,
      setLang,
      pendingFetchOperations,
      links: { HOME_URI },
    } = this.props;

    return (
      <header className="main-header fixed">
        <Link to={HOME_URI} className="logo">
          <span className="logo-mini">
            {pendingFetchOperations ? (
              <LoadingIcon gapRight />
            ) : (
              <React.Fragment>
                Re<b>X</b>
              </React.Fragment>
            )}
          </span>
          <span className="logo-lg">
            {pendingFetchOperations && (
              <span style={{ position: 'absolute', left: '1em' }}>
                <LoadingIcon gapRight />
              </span>
            )}
            Re<b>CodEx</b>
          </span>
        </Link>

        <div className="navbar navbar-static-top" role="navigation">
          <ClientOnly>
            <MediaQuery maxWidth={767}>
              <a href="#" className="sidebar-toggle" role="button" onClick={this.toggleSidebarVisibility}>
                <span className="sr-only">
                  <FormattedMessage id="app.header.toggleSidebar" defaultMessage="Show/hide sidebar" />
                </span>
              </a>
            </MediaQuery>
            <MediaQuery minWidth={768}>
              <a
                href="#"
                className="sidebar-toggle"
                role="button"
                onClick={this.toggleSidebarSize}
                style={{ fontFamily: 'sans' }}>
                <span className="sr-only">
                  <FormattedMessage id="app.header.toggleSidebarSize" defaultMessage="Expand/minimize sidebar" />
                </span>
              </a>
            </MediaQuery>
          </ClientOnly>
          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              {isLoggedIn && <HeaderSystemMessagesContainer locale={currentLang} />}
              <HeaderNotificationsContainer />
              {availableLangs.map(lang => (
                <HeaderLanguageSwitching lang={lang} active={currentLang === lang} key={lang} setLang={setLang} />
              ))}
            </ul>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  toggleSidebarSize: PropTypes.func.isRequired,
  toggleSidebarVisibility: PropTypes.func.isRequired,
  currentLang: PropTypes.string.isRequired,
  setLang: PropTypes.func.isRequired,
  availableLangs: PropTypes.array,
  currentUrl: PropTypes.string,
  pendingFetchOperations: PropTypes.bool,
  links: PropTypes.object,
};

export default withLinks(Header);
