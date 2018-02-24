import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '../../widgets/FlatButton';
import { FailedIcon } from '../../icons';

const DeletingFailedButton = ({ onClick, ...props }) =>
  <Button
    bsStyle="default"
    bsSize="sm"
    className="btn-flat"
    onClick={onClick}
    {...props}
  >
    <FailedIcon />{' '}
    <FormattedMessage
      id="generic.deleteFailed"
      defaultMessage="Delete Failed"
    />
  </Button>;

DeletingFailedButton.propTypes = {
  onClick: PropTypes.func
};

export default DeletingFailedButton;
