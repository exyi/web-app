import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';

import FilesTableContainer from '../FilesTableContainer';
import {
  AttachmentFilesTableRow,
  AttachmentFilesTableHeaderRow
} from '../../components/Exercises/FilesTable';

import {
  fetchAttachmentFiles,
  addAttachmentFiles,
  removeAttachmentFile
} from '../../redux/modules/attachmentFiles';

import { createGetAttachmentFiles } from '../../redux/selectors/attachmentFiles';

const AttachmentFilesTableContainer = ({
  exercise,
  attachmentFiles,
  loadFiles,
  addFiles,
  removeFile
}) =>
  <FilesTableContainer
    uploadId={`attachment-exercise-files-${exercise.id}`}
    attachments={attachmentFiles}
    loadFiles={loadFiles}
    addFiles={addFiles}
    removeFile={removeFile}
    title={
      <FormattedMessage
        id="app.attachmentFilesTable.title"
        defaultMessage="Attached files"
      />
    }
    description={
      <FormattedMessage
        id="app.attachmentFilesTable.description"
        defaultMessage="Attached files are files which can be used within exercise description using links provided below. Attached files can be viewed or downloaded by students."
      />
    }
    HeaderComponent={AttachmentFilesTableHeaderRow}
    RowComponent={AttachmentFilesTableRow}
  />;

AttachmentFilesTableContainer.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    attachmentFilesIds: PropTypes.array.isRequired
  }).isRequired,
  attachmentFiles: ImmutablePropTypes.map,
  loadFiles: PropTypes.func.isRequired,
  addFiles: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired
};

export default connect(
  (state, { exercise }) => {
    const getAttachmentFiles = createGetAttachmentFiles(
      exercise.attachmentFilesIds
    );
    return {
      attachmentFiles: getAttachmentFiles(state)
    };
  },
  (dispatch, { exercise }) => ({
    loadFiles: () => dispatch(fetchAttachmentFiles(exercise.id)),
    addFiles: files => dispatch(addAttachmentFiles(exercise.id, files)),
    removeFile: id => dispatch(removeAttachmentFile(exercise.id, id))
  })
)(AttachmentFilesTableContainer);