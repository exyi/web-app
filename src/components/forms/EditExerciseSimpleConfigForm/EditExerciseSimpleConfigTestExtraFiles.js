import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import Button from '../../widgets/FlatButton';
import Icon from '../../icons';
import { ExpandingInputFilesField } from '../Fields';
import Confirm from '../../forms/Confirm';

const EditExerciseSimpleConfigTestExtraFiles = ({
  change,
  smartFillExtraFiles,
  supplementaryFiles,
  test,
  testErrors,
  environmentId,
}) => (
  <React.Fragment>
    <h4>
      <FormattedMessage id="app.editExerciseSimpleConfigTests.extraFilesTitle" defaultMessage="Extra Files" />
    </h4>

    <FieldArray
      name={`${test}.extra-files.${environmentId}`}
      component={ExpandingInputFilesField}
      options={supplementaryFiles}
      change={change}
      leftLabel={
        <FormattedMessage id="app.editExerciseSimpleConfigTests.extraFilesActual" defaultMessage="Extra file:" />
      }
      rightLabel={
        <FormattedMessage id="app.editExerciseSimpleConfigTests.extraFilesRename" defaultMessage="Rename as:" />
      }
      noItems={
        <FormattedMessage
          id="app.editExerciseSimpleConfigTests.noExtraFiles"
          defaultMessage="There are no extra files yet..."
        />
      }
    />

    {Boolean(smartFillExtraFiles) && (
      <div className="smart-fill-tinybar">
        <Confirm
          id="smartFillExtraFiles"
          onConfirmed={smartFillExtraFiles}
          question={
            <FormattedMessage
              id="app.editExerciseConfigForm.smartFillCompilation.yesNoQuestion"
              defaultMessage="Do you really wish to overwrite compilation and execution configuration of all subsequent tests using the first test as a template? Files will be paired to individual test configurations by a heuristics based on matching name substrings."
            />
          }>
          <Button bsStyle="primary" className="btn-flat" bsSize="xs" disabled={Boolean(testErrors)}>
            <Icon icon="arrows-alt" gapRight />
            <FormattedMessage
              id="app.editExerciseConfigForm.smartFillExtraFiles"
              defaultMessage="Smart Fill Extra Files"
            />
          </Button>
        </Confirm>
      </div>
    )}
  </React.Fragment>
);

EditExerciseSimpleConfigTestExtraFiles.propTypes = {
  change: PropTypes.func.isRequired,
  smartFillExtraFiles: PropTypes.func,
  supplementaryFiles: PropTypes.array.isRequired,
  test: PropTypes.string.isRequired,
  testErrors: PropTypes.object,
  environmentId: PropTypes.string.isRequired,
};

export default EditExerciseSimpleConfigTestExtraFiles;
