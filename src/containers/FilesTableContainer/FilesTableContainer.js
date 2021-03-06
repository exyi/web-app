import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import FilesTable from '../../components/Exercises/FilesTable';

import { reset } from '../../redux/modules/upload';
import { createGetUploadedFiles, createAllUploaded } from '../../redux/selectors/upload';

class FilesTableContainer extends Component {
  componentDidMount() {
    FilesTableContainer.loadData(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.uploadId !== prevProps.uploadId) {
      FilesTableContainer.loadData(this.props);
    }
  }

  static loadData = ({ loadFiles }) => {
    loadFiles();
  };

  render = () => <FilesTable {...this.props} />;
}

FilesTableContainer.propTypes = {
  uploadId: PropTypes.string.isRequired,
  attachments: ImmutablePropTypes.map,
  newFiles: PropTypes.array,
  canSubmit: PropTypes.bool,
  addFiles: PropTypes.func,
};

export default connect(
  (state, { uploadId }) => ({
    uploadId,
    newFiles: createGetUploadedFiles(uploadId)(state),
    canSubmit: createAllUploaded(uploadId)(state),
  }),
  (dispatch, { uploadId, addFiles }) => ({
    addFiles: files => addFiles(files).then(dispatch(reset(uploadId))),
  })
)(FilesTableContainer);
