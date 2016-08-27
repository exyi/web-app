import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'react-fontawesome';
import { ButtonGroup, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { TreeView, TreeViewItem } from '../../AdminLTE/TreeView';
import { GROUP_URI_FACTORY } from '../../../links';
import { isReady } from '../../../redux/helpers/resourceManager';
import LeaveJoinGroupButtonContainer from '../../../containers/LeaveJoinGroupButtonContainer';

class GroupTree extends Component {

  renderLoading = level => (
    <TreeView>
      <TreeViewItem
        level={level}
        title={<FormattedMessage id='app.groupTree.loading' defaultMessage='Loading ...' />} />
    </TreeView>
  );

  renderButtons = id => (
    <ButtonGroup>
      <LinkContainer to={GROUP_URI_FACTORY(id)}>
        <Button bsStyle='primary' bsSize='xs' className='btn-flat'>
          <Icon name='group' /> <FormattedMessage id='app.groupTree.detailButton' defaultMessage="See group's page" />
        </Button>
      </LinkContainer>
    </ButtonGroup>
  );

  render() {
    const {
      id,
      level = 0,
      groups,
      isMemberOf
    } = this.props;

    const group = groups.get(id);
    if (!group || !isReady(group)) {
      return this.renderLoading(level);
    }

    const { name, childGroups } = group.get('data').toJS();
    return (
      <TreeView>
        <TreeViewItem
          title={name}
          level={level}
          actions={this.renderButtons(id)}>
          {childGroups.map(id =>
            <GroupTree {...this.props} key={id} id={id} level={level + 1} />)}
        </TreeViewItem>
      </TreeView>
    );
  }

}

GroupTree.propTypes = {
  id: PropTypes.string.isRequired,
  groups: PropTypes.object.isRequired
};

export default GroupTree;
