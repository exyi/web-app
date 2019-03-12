import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Alert, FormControl, ControlLabel, Well } from 'react-bootstrap';

import Box from '../../widgets/Box';
import AuthenticationButtonContainer from '../../../containers/CAS/AuthenticationButtonContainer';
import { safeGet } from '../../../helpers/common';
import { getConfigVar } from '../../../redux/helpers/api/tools';

const casHelpdeskUrl = getConfigVar('CAS_HELPDESK_URL');

class RegistrationCAS extends Component {
  state = { instanceId: null, failed: false };

  changeInstance = ev => {
    this.setState({ instanceId: ev.target.value });
  };

  ticketObtainedHandler = (ticket, clientUrl) => {
    const { instances, onSubmit } = this.props;
    this.setState({ failed: false });
    onSubmit({
      instanceId: this.state.instanceId || safeGet(instances, [0, 'id']),
      serviceId: 'cas-uk',
      clientUrl,
      ticket,
    });
  };

  failedHandler = () => {
    this.setState({ failed: true });
  };

  render() {
    const { instances } = this.props;
    return (
      <Box
        title={<FormattedMessage id="app.cas.registration.title" defaultMessage="Register Account Bound to CAS" />}
        footer={
          <div className="text-center">
            <AuthenticationButtonContainer
              retry={this.state.failed}
              onTicketObtained={this.ticketObtainedHandler}
              onFailed={this.failedHandler}
            />
          </div>
        }>
        <div>
          {this.state.failed && (
            <Alert bsStyle="danger">
              <p>
                <FormattedMessage
                  id="app.externalRegistrationForm.failed"
                  defaultMessage="Registration failed. Please check the notification message for more details."
                />
              </p>
              {casHelpdeskUrl && casHelpdeskUrl.startsWith('mailto:') && (
                <p>
                  <FormattedHTMLMessage
                    id="app.externalRegistrationForm.failedHelpdeskMail"
                    defaultMessage=" If the problems prevail, please, contact the <a href='{casHelpdeskUrl}'>technical support</a>."
                    values={{ casHelpdeskUrl }}
                  />
                </p>
              )}
              {casHelpdeskUrl && !casHelpdeskUrl.startsWith('mailto:') && (
                <p>
                  <FormattedHTMLMessage
                    id="app.externalRegistrationForm.failedHelpdeskPage"
                    defaultMessage=" If the problems prevail, please, visit the <a href='{casHelpdeskUrl}'>help page</a>."
                    values={{ casHelpdeskUrl }}
                  />
                </p>
              )}
            </Alert>
          )}

          <Well>
            <FormattedMessage
              id="app.cas.registration.description"
              defaultMessage="Created account will be bound to external identifier provided by UK CAS. Such account may use both external CAS authentication or locally created credentials. Furthermore, accounts bound to CAS may use additional features provided by SIS bindings."
            />
          </Well>
          {/* We are NOT creating a redux-form here, so we build FormControl manually (instead of using SelectField). */}
          <ControlLabel>
            <FormattedMessage id="app.externalRegistrationForm.instance" defaultMessage="Instance:" />
          </ControlLabel>
          <FormControl componentClass="select" bsClass="form-control full-width" onChange={this.changeInstance}>
            {instances.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </FormControl>
        </div>
      </Box>
    );
  }
}

RegistrationCAS.propTypes = {
  instances: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RegistrationCAS;
