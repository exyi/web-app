import React, { PropTypes } from 'react';
import { ListGroupItem, Clearfix } from 'react-bootstrap';
import Icon from 'react-fontawesome';
import { Link } from 'react-router';

const UsersListItem = ({
  id,
  fullName,
  avatarUrl
}, {
  links: { USER_URI_FACTORY }
}) => (
  <tr>
    <td className='text-center' width={80}>
      <img src={avatarUrl} className='img-circle' width={45} />
    </td>
    <td>
      <p><strong>{fullName}</strong></p>
      <small><Link to={USER_URI_FACTORY(id)}>{id}</Link></small>
    </td>
  </tr>
);

UsersListItem.propTypes = {
  id: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired
};

UsersListItem.contextTypes = {
  links: PropTypes.object
};

export default UsersListItem;
