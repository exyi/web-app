import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { searchExercises } from '../../redux/modules/search';
import SearchContainer from '../SearchContainer';
import ExercisesList from '../../components/Exercises/ExercisesList';

const SelectExerciseContainer = ({
  id,
  search,
  createActions
}) => (
  <SearchContainer
    type='exercises'
    id={id}
    search={search}
    renderList={
      (exercises) => <ExercisesList exercises={exercises} createActions={createActions} />
    } />
);

SelectExerciseContainer.propTypes = {
  id: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
  createActions: PropTypes.func
};

const mapDispatchToProps = (dispatch, { id }) => ({
  search: (query) => dispatch(searchExercises()(id, query))
});

export default connect(undefined, mapDispatchToProps)(SelectExerciseContainer);
