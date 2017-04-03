import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';
import { Table } from 'react-bootstrap';
import ResourceRenderer from '../../ResourceRenderer';
import Icon from 'react-fontawesome';

const ReferenceSolutionsList = ({
  referenceSolutions = [],
  renderButtons = () => null,
  ...props
}) => (
  <Table hover {...props}>
    <thead>
      <tr>
        <th></th>
        <th><FormattedMessage id='app.exercises.referenceSolutionDescription' defaultMessage='Description' /></th>
        <th><FormattedMessage id='app.exercises.referenceSolutionUploadedAt' defaultMessage='Uploaded at' /></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {referenceSolutions
        .map(({ id, uploadedAt, description }) => (
          <tr key={id}>
            <td className='text-center'>
              <Icon name='file-code-o' />
            </td>
            <td>
              {description}
            </td>
            <td>
              <FormattedDate value={new Date(uploadedAt * 1000)} /> &nbsp; <FormattedTime value={new Date(uploadedAt * 1000)} />
            </td>
            <td className='text-right'>
              {renderButtons(id)}
            </td>
          </tr>
        ))}
    </tbody>
  </Table>
);

ReferenceSolutionsList.propTypes = {
  referenceSolutions: PropTypes.array.isRequired,
  renderButtons: PropTypes.func
};

export default ReferenceSolutionsList;