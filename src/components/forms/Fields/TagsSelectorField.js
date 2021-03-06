import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { ControlLabel, Label } from 'react-bootstrap';
import { defaultMemoize } from 'reselect';
import classnames from 'classnames';

import { AddIcon, CloseIcon } from '../../icons';
import { getTagStyle } from '../../../helpers/exercise/tags';

const activeTagsIndex = defaultMemoize(fields => {
  const res = {};
  fields.forEach((_, index) => (res[fields.get(index)] = index));
  return res;
});

const TagsSelectorField = ({ tags = [], fields, label = null }) => {
  const active = activeTagsIndex(fields);

  return (
    <React.Fragment>
      {Boolean(label) && <ControlLabel>{label}</ControlLabel>}
      <div className="larger">
        {tags.sort().map(tag => (
          <Label
            key={tag}
            bsSize="lg"
            style={getTagStyle(tag)}
            className={classnames({
              'tag-margin': true,
              'halfem-padding': true,
              timid: active[tag] === undefined,
              clickable: true,
            })}
            onClick={() => (active[tag] === undefined ? fields.push(tag) : fields.remove(active[tag]))}>
            {tag}
            {active[tag] === undefined ? <AddIcon gapLeft /> : <CloseIcon gapLeft />}
          </Label>
        ))}
      </div>
    </React.Fragment>
  );
};

TagsSelectorField.propTypes = {
  tags: PropTypes.array,
  fields: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    active: PropTypes.bool,
    dirty: PropTypes.bool,
    error: PropTypes.any,
    warning: PropTypes.any,
  }).isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.shape({ type: PropTypes.oneOf([FormattedMessage]) }),
  ]),
  noItems: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.shape({ type: PropTypes.oneOf([FormattedMessage]) }),
  ]),
  validateEach: PropTypes.func,
};

export default TagsSelectorField;
