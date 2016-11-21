import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';

import Box from '../../AdminLTE/Box';
import AddStudent from '../AddStudent';
import AddAssignment from '../AddAssignment';
import SupervisorsStudentsList from '../SupervisorsStudentsList';
import AdminAssignmentsTable from '../../Assignments/AdminAssignmentsTable';

const SupervisorsView = ({
  group,
  students,
  stats,
  assignments,
  assignFunc
}) => (
  <div>
    <Row>
      <Col lg={12}>
        <h3 className='page-header'>
          <FormattedMessage
            id='app.group.supervisorsView.title'
            defaultMessage="Supervisor's controls of {groupName}"
            values={{ groupName: group.name }} />
        </h3>
      </Col>
    </Row>
    <Row>
      <Col lg={6}>
        <Box
          title={<FormattedMessage id='app.group.spervisorsView.students' defaultMessage='Students' />}
          collapsable
          noPadding>
          <SupervisorsStudentsList
            groupId={group.id}
            users={students}
            isLoaded={students.length === group.students.length}
            stats={stats}
            fill />
        </Box>
        <Box
          title={<FormattedMessage id='app.group.spervisorsView.addStudent' defaultMessage='Add student' />}
          collapsable
          isOpen>
          <AddStudent instanceId={group.instanceId} groupId={group.id} />
        </Box>
      </Col>
      <Col lg={6}>
        <Box
          title={<FormattedMessage id='app.group.spervisorsView.assignments' defaultMessage='Assignments' />}
          collapsable
          noPadding
          isOpen>
          <AdminAssignmentsTable assignments={assignments} />
        </Box>
        <Box
          title={<FormattedMessage id='app.group.spervisorsView.addAssignment' defaultMessage='Add assignment' />}
          collapsable
          isOpen>
          <AddAssignment groupId={group.id} assignFunc={assignFunc} />
        </Box>
      </Col>
    </Row>
  </div>
);

SupervisorsView.propTypes = {
  group: PropTypes.object.isRequired,
  students: PropTypes.array,
  stats: ImmutablePropTypes.map,
  assignments: ImmutablePropTypes.list.isRequired,
  assignFunc: PropTypes.func.isRequired
};

export default SupervisorsView;
