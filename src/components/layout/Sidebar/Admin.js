import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import MenuTitle from '../../widgets/Sidebar/MenuTitle';
import MenuItem from '../../widgets/Sidebar/MenuItem';

import withLinks from '../../../helpers/withLinks';

const Admin = ({ currentUrl, links: { ADMIN_INSTANCES_URI, USERS_URI, FAILURES_URI, BROKER_URI, MESSAGES_URI } }) => (
  <ul className="sidebar-menu">
    <MenuTitle title={<FormattedMessage id="app.sudebar.menu.admin.title" defaultMessage="Administration" />} />
    <MenuItem
      icon="university"
      title={<FormattedMessage id="app.sidebar.menu.admin.instances" defaultMessage="Instances" />}
      currentPath={currentUrl}
      link={ADMIN_INSTANCES_URI}
    />
    <MenuItem
      icon="users"
      title={<FormattedMessage id="app.sidebar.menu.admin.users" defaultMessage="Users" />}
      currentPath={currentUrl}
      link={USERS_URI}
    />
    <MenuItem
      icon="bomb"
      title={<FormattedMessage id="app.sidebar.menu.admin.failures" defaultMessage="Submission Failures" />}
      currentPath={currentUrl}
      link={FAILURES_URI}
    />
    <MenuItem
      icon="envelope"
      title={<FormattedMessage id="app.sidebar.menu.admin.messages" defaultMessage="System Messages" />}
      currentPath={currentUrl}
      link={MESSAGES_URI}
    />
    <MenuItem
      icon="server"
      title={<FormattedMessage id="app.sidebar.menu.admin.broker" defaultMessage="Broker Management" />}
      currentPath={currentUrl}
      link={BROKER_URI}
    />
  </ul>
);

Admin.propTypes = {
  currentUrl: PropTypes.string.isRequired,
  links: PropTypes.object.isRequired,
};

export default withLinks(Admin);
