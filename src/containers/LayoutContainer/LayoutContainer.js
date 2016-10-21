import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import moment from 'moment';
import Layout from '../../components/Layout';

import { toggleSize, toggleVisibility } from '../../redux/modules/sidebar';
import { isVisible, isCollapsed } from '../../redux/selectors/sidebar';
import { loggedInUserIdSelector, accessTokenSelector } from '../../redux/selectors/auth';
import { usersGroupsIds } from '../../redux/selectors/users';
import { fetchUserIfNeeded } from '../../redux/modules/users';
import { fetchUsersGroupsIfNeeded } from '../../redux/modules/groups';
import { logout, refresh } from '../../redux/modules/auth';
import { isTokenValid, willExpireSoon } from '../../redux/helpers/token';
import { fetchUsersInstancesIfNeeded } from '../../redux/modules/instances';
import { messages, localeData, defaultLanguage } from '../../locales';
import { linksFactory, isAbsolute } from '../../links';

class LayoutContainer extends Component {

  state = { links: null };

  componentWillMount() {
    this.loadData(this.props);
    this.changeLang(this.props);
    this.checkAuthentication();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.userId !== newProps.userId) {
      this.loadData(newProps);
    }

    if (this.props.params.lang !== newProps.params.lang) {
      this.changeLang(newProps);
    }

    this.checkAuthentication();
  }

  checkAuthentication = () => {
    const { isLoggedIn, accessToken, refreshToken, logout } = this.props;
    const token = accessToken ? accessToken.toJS() : null;
    if (isLoggedIn) {
      if (!isTokenValid(token)) {
        logout(this.state.links.HOME_URI);
      } else if (willExpireSoon(token) && !this.isRefreshingToken) {
        this.isRefreshingToken = true;
        refreshToken()
          .catch(() => logout(this.state.links.HOME_URI))
          .then(() => {
            this.isRefreshingToken = false;
          });
      }
    }
  };

  getLang = props => {
    let lang = props.params.lang;
    if (!lang) {
      lang = defaultLanguage;
    }

    return lang;
  };

  changeLang = props => {
    const lang = this.getLang(props);
    this.setState({ lang, links: linksFactory(lang) });
  };

  getChildContext = () => ({
    links: this.state.links,
    lang: this.state.lang,
    isActive: link => !isAbsolute(link) && this.context.router.isActive(link, true)
  });

  maybeHideSidebar = e => {
    e.preventDefault();
    const { sidebar, toggleSidebar } = this.props;
    if (sidebar.isOpen) {
      toggleSidebar.visibility();
    }
  };

  /**
   * Get messages for the given language or the deafult - English
   */

  getMessages = lang => messages[lang] || messages[this.getDefaultLang()];
  getLocaleData = lang => localeData[lang] || localeData[this.getDefaultLang()];

  loadData = ({
    isLoggedIn,
    userId,
    loadUserDataIfNeeded,
    loadUsersGroupsIfNeeded,
    loadUsersInstancesIfNeeded
  }) => {
    if (isLoggedIn === true) {
      loadUserDataIfNeeded(userId);
      loadUsersGroupsIfNeeded(userId);
      loadUsersInstancesIfNeeded(userId);
    }
  };

  render() {
    const { children, location: { pathname } } = this.props;
    const { lang, links: { HOME_URI } } = this.state;
    addLocaleData([ ...this.getLocaleData(lang) ]);
    moment.locale(lang);

    return (
      <IntlProvider locale={lang} messages={this.getMessages(lang)}>
        <Layout
          {...this.props}
          onCloseSidebar={this.maybeHideSidebar}
          lang={lang}
          availableLangs={Object.keys(messages)}
          currentUrl={pathname} />
      </IntlProvider>
    );
  }

}

LayoutContainer.childContextTypes = {
  lang: PropTypes.string,
  links: PropTypes.object,
  isActive: PropTypes.func
};

LayoutContainer.contextTypes = {
  router: PropTypes.object
};

const mapStateToProps = (state, props) => ({
  sidebar: {
    isOpen: isVisible(state),
    isCollapsed: isCollapsed(state)
  },
  accessToken: accessTokenSelector(state),
  isLoggedIn: !!loggedInUserIdSelector(state),
  userId: loggedInUserIdSelector(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  toggleSidebar: {
    visibility: () => dispatch(toggleVisibility()),
    size: () => dispatch(toggleSize())
  },
  loadUserDataIfNeeded: (userId) => dispatch(fetchUserIfNeeded(userId)),
  loadUsersGroupsIfNeeded: (userId) => dispatch(fetchUsersGroupsIfNeeded(userId)),
  loadUsersInstancesIfNeeded: (userId) => dispatch(fetchUsersInstancesIfNeeded(userId)),
  refreshToken: (accessToken) => dispatch(refresh(accessToken)),
  logout: (accessToken) => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutContainer);
