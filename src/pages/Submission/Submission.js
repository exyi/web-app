import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import Page from '../../components/layout/Page';
import ResourceRenderer from '../../components/helpers/ResourceRenderer';
import SubmissionDetail, {
  FailedSubmissionDetail
} from '../../components/Submissions/SubmissionDetail';
import AcceptSolutionContainer from '../../containers/AcceptSolutionContainer';
import ResubmitSolutionContainer from '../../containers/ResubmitSolutionContainer';
import HierarchyLineContainer from '../../containers/HierarchyLineContainer';
import FetchManyResourceRenderer from '../../components/helpers/FetchManyResourceRenderer';

import { fetchRuntimeEnvironments } from '../../redux/modules/runtimeEnvironments';
import { fetchGroupsStats } from '../../redux/modules/stats';
import { fetchAssignmentIfNeeded } from '../../redux/modules/assignments';
import { fetchSolutionIfNeeded } from '../../redux/modules/solutions';
import { fetchSubmissionEvaluationsForSolution } from '../../redux/modules/submissionEvaluations';
import { getSolution } from '../../redux/selectors/solutions';
import {
  getAssignment,
  assignmentEnvironmentsSelector
} from '../../redux/selectors/assignments';

import {
  isSupervisorOf,
  isAdminOf,
  isLoggedAsSuperAdmin
} from '../../redux/selectors/users';
import { loggedInUserIdSelector } from '../../redux/selectors/auth';
import {
  evaluationsForSubmissionSelector,
  fetchManyStatus
} from '../../redux/selectors/submissionEvaluations';
import { getLocalizedName } from '../../helpers/getLocalizedData';

class Submission extends Component {
  static loadAsync = ({ submissionId, assignmentId }, dispatch) =>
    Promise.all([
      dispatch(fetchRuntimeEnvironments()),
      dispatch(fetchSolutionIfNeeded(submissionId)),
      dispatch(fetchSubmissionEvaluationsForSolution(submissionId)),
      dispatch(fetchAssignmentIfNeeded(assignmentId))
        .then(res => res.value)
        .then(assignment => dispatch(fetchGroupsStats(assignment.groupId)))
    ]);

  componentWillMount() {
    this.props.loadAsync();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.params.submissionId !== newProps.params.submissionId) {
      newProps.loadAsync();
    }
  }

  render() {
    const {
      assignment,
      solution,
      params: { assignmentId },
      isSupervisorOrMore,
      evaluations,
      runtimeEnvironments,
      fetchStatus,
      intl: { locale }
    } = this.props;

    return (
      <Page
        resource={assignment}
        title={assignment => getLocalizedName(assignment, locale)}
        description={
          <FormattedMessage
            id="app.submission.evaluation.title"
            defaultMessage="Solution evaluation"
          />
        }
        breadcrumbs={[
          {
            resource: assignment,
            iconName: 'users',
            breadcrumb: assignment => ({
              text: (
                <FormattedMessage
                  id="app.group.title"
                  defaultMessage="Group detail"
                />
              ),
              link: ({ GROUP_DETAIL_URI_FACTORY }) =>
                GROUP_DETAIL_URI_FACTORY(assignment.groupId)
            })
          },
          {
            resource: assignment,
            iconName: 'puzzle-piece',
            breadcrumb: assignment => ({
              text: (
                <FormattedMessage
                  id="app.exercise.title"
                  defaultMessage="Exercise"
                />
              ),
              link: ({ EXERCISE_URI_FACTORY }) =>
                isSupervisorOrMore(assignment.groupId)
                  ? EXERCISE_URI_FACTORY(assignment.exerciseId)
                  : '#'
            })
          },
          {
            text: (
              <FormattedMessage
                id="app.assignment.title"
                defaultMessage="Exercise Assignment"
              />
            ),
            iconName: 'hourglass-start',
            link: ({ ASSIGNMENT_DETAIL_URI_FACTORY }) =>
              ASSIGNMENT_DETAIL_URI_FACTORY(assignmentId)
          },
          {
            text: (
              <FormattedMessage
                id="app.solution.title"
                defaultMessage="The Solution"
              />
            ),
            iconName: 'user'
          }
        ]}
      >
        <ResourceRenderer
          failed={<FailedSubmissionDetail />}
          resource={[solution, assignment]}
        >
          {(solution, assignment) =>
            <div>
              <HierarchyLineContainer groupId={assignment.groupId} />
              {isSupervisorOrMore(assignment.groupId) &&
                <p>
                  <AcceptSolutionContainer id={solution.id} />
                  <ResubmitSolutionContainer
                    id={solution.id}
                    assignmentId={assignment.id}
                    isDebug={false}
                    userId={solution.solution.userId}
                  />
                  <ResubmitSolutionContainer
                    id={solution.id}
                    assignmentId={assignment.id}
                    isDebug={true}
                    userId={solution.solution.userId}
                  />
                </p>}
              <ResourceRenderer resource={runtimeEnvironments}>
                {(...runtimes) =>
                  <FetchManyResourceRenderer fetchManyStatus={fetchStatus}>
                    {() =>
                      <SubmissionDetail
                        solution={solution}
                        assignment={assignment}
                        isSupervisor={isSupervisorOrMore(assignment.groupId)}
                        evaluations={evaluations}
                        runtimeEnvironments={runtimes}
                      />}
                  </FetchManyResourceRenderer>}
              </ResourceRenderer>
            </div>}
        </ResourceRenderer>
      </Page>
    );
  }
}

Submission.propTypes = {
  params: PropTypes.shape({
    assignmentId: PropTypes.string.isRequired,
    submissionId: PropTypes.string.isRequired
  }).isRequired,
  assignment: PropTypes.object,
  children: PropTypes.element,
  solution: PropTypes.object,
  loadAsync: PropTypes.func.isRequired,
  isSupervisorOrMore: PropTypes.func.isRequired,
  evaluations: PropTypes.object,
  runtimeEnvironments: PropTypes.array,
  fetchStatus: PropTypes.string,
  intl: intlShape
};

export default connect(
  (state, { params: { submissionId, assignmentId } }) => ({
    solution: getSolution(submissionId)(state),
    assignment: getAssignment(state)(assignmentId),
    isSupervisorOrMore: groupId =>
      isSupervisorOf(loggedInUserIdSelector(state), groupId)(state) ||
      isAdminOf(loggedInUserIdSelector(state), groupId)(state) ||
      isLoggedAsSuperAdmin(state),
    evaluations: evaluationsForSubmissionSelector(submissionId)(state),
    runtimeEnvironments: assignmentEnvironmentsSelector(state)(assignmentId),
    fetchStatus: fetchManyStatus(submissionId)(state)
  }),
  (dispatch, { params }) => ({
    loadAsync: () => Submission.loadAsync(params, dispatch)
  })
)(injectIntl(Submission));
