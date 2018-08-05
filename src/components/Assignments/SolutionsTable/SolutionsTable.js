import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';
import { OverlayTrigger, Tooltip, Table } from 'react-bootstrap';

import Box from '../../widgets/Box';
import ResourceRenderer from '../../helpers/ResourceRenderer';
import LoadingSolutionsTableRow from './LoadingSolutionsTableRow';
import NoSolutionYetTableRow from './NoSolutionYetTableRow';
import FailedLoadingSolutionsTableRow from './FailedLoadingSolutionsTableRow';
import SolutionsTableRow from './SolutionsTableRow';

const SolutionsTable = ({
  title,
  assignmentId,
  solutions,
  runtimeEnvironments,
  noteMaxlen = 32
}) =>
  <Box title={title} collapsable isOpen noPadding unlimitedHeight>
    <Table responsive>
      <thead>
        <tr>
          <th />
          <th />
          <th>
            <FormattedMessage
              id="app.solutionsTable.submissionDate"
              defaultMessage="Date of submission"
            />
          </th>
          <th className="text-center">
            <FormattedMessage
              id="app.solutionsTable.solutionValidity"
              defaultMessage="Solution validity"
            />
          </th>
          <th className="text-center">
            <FormattedMessage
              id="app.solutionsTable.receivedPoints"
              defaultMessage="Received points"
            />
          </th>
          <th className="text-center">
            <FormattedMessage
              id="app.solutionsTable.environment"
              defaultMessage="Target language"
            />
          </th>
          <th>
            <FormattedMessage
              id="app.solutionsTable.note"
              defaultMessage="Note"
            />
          </th>
          <th />
        </tr>
      </thead>
      <ResourceRenderer
        resource={solutions.toArray()}
        loading={<LoadingSolutionsTableRow />}
        failed={<FailedLoadingSolutionsTableRow />}
        returnAsArray
      >
        {solutions =>
          <tbody>
            {solutions.map(data => {
              const id = data.id;
              const runtimeEnvironment =
                data.runtimeEnvironmentId &&
                runtimeEnvironments &&
                runtimeEnvironments.find(
                  ({ id }) => id === data.runtimeEnvironmentId
                );

              const note =
                !data.note || data.note.length <= noteMaxlen
                  ? data.note
                  : <OverlayTrigger
                      placement="left"
                      overlay={
                        <Tooltip id={id}>
                          {data.note}
                        </Tooltip>
                      }
                    >
                      <span>
                        {data.note.substr(0, noteMaxlen - 3).trim()}&hellip;
                      </span>
                    </OverlayTrigger>;

              return (
                <SolutionsTableRow
                  key={id}
                  id={id}
                  status={
                    data.lastSubmission
                      ? data.lastSubmission.evaluationStatus
                      : null
                  }
                  runtimeEnvironment={runtimeEnvironment}
                  note={note}
                  assignmentId={assignmentId}
                  {...data}
                />
              );
            })}
          </tbody>}
      </ResourceRenderer>
      {solutions.size === 0 &&
        <tbody>
          <NoSolutionYetTableRow />
        </tbody>}
    </Table>
  </Box>;

SolutionsTable.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ type: PropTypes.oneOf([FormattedMessage]) }),
    PropTypes.element
  ]).isRequired,
  assignmentId: PropTypes.string.isRequired,
  solutions: PropTypes.instanceOf(List),
  runtimeEnvironments: PropTypes.array,
  noteMaxlen: PropTypes.number
};

export default SolutionsTable;