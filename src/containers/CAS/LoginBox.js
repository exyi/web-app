import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import LoginButton from '../../components/CAS/LoginButton';
import Box from '../../components/AdminLTE/Box';
import {
  externalLogin,
  externalLoginFailed,
  loginServices
} from '../../redux/modules/auth';
import { statusSelector } from '../../redux/selectors/auth';

const LoginBox = (
  {
    login,
    fail,
    status
  }
) => (
  <Box
    title={
      <FormattedMessage
        id="app.cas.login.title"
        defaultMessage="Authenticate throught CAS UK"
      />
    }
    footer={
      <div className="text-center">
        <LoginButton onLogin={login} onFailed={fail} loginStatus={status} />
      </div>
    }
  >
    <FormattedMessage
      id="app.cas.login.description"
      defaultMessage="After you click on the button below, you will be redirected to CAS UK. After you are authenticated, the popup window will be closed and you will be logged into ReCodEx."
    />
  </Box>
);

LoginBox.propTypes = {
  login: PropTypes.func.isRequired,
  fail: PropTypes.func.isRequired,
  status: PropTypes.string
};

export default connect(
  state => ({
    status: statusSelector(loginServices.external.CAS_UK_TICKET)(state)
  }),
  dispatch => ({
    fail: () =>
      dispatch(externalLoginFailed(loginServices.external.CAS_UK_TICKET)),
    login: (ticket, clientUrl) => {
      const login = externalLogin(loginServices.external.CAS_UK_TICKET);
      return dispatch(login({ ticket, clientUrl }));
    }
  })
)(LoginBox);
