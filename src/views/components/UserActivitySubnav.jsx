import React from 'react';
import querystring from 'querystring';
import SortDropdownFactory from '../components/SortDropdown';
var SortDropdown;
import DropdownFactory from '../components/Dropdown';
var Dropdown;
import CheckmarkIconFactory from '../components/CheckmarkIcon';
var CheckmarkIcon;

const _ACTIVITY_TYPE_OPEN = 'userActivitySubnav:activityType:open';

class UserActivitySubnav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      sort: props.sort || 'hot',
      activity: props.activity || 'comments',
    };

    this._onOpen = this._onOpen.bind(this);
    this._id = Math.random();
  }

  componentDidMount() {
    this.props.app.on(_ACTIVITY_TYPE_OPEN + ':' + this._id, this._onOpen);
  }

  componentWillUnmount() {
    this.props.app.off(_ACTIVITY_TYPE_OPEN + ':' + this._id, this._onOpen);
  }

  _onOpen(bool) {
    this.setState({
      opened: bool,
    });
  }

  buildUrl(base, activity, sort, page) {
    var url = base;

    var q = {
      activity: activity,
    };

    if (sort) {
      q.sort = sort;
    }

    if (page) {
      q.page = page;
    }

    return url + '?' + querystring.stringify(q);
  }

  render() {
    var baseUrl = `/u/${this.props.name}/activity`;
    var activity = this.state.activity;
    var sortList = 'comments';

    switch (activity) {
      case 'listings':
        sortList = 'listings';
        break;
      case 'overview':
      case 'gilded':
        sortList = 'both';
        break;
    }

    var dropdownList = [
      {
        activity: 'comments',
        text: 'Submitted comments',
      },
      {
        activity: 'submitted',
        text: 'Submitted posts',
      },
      {
        activity: 'overview',
        text: 'Comments and posts',
      },
      {
        activity: 'gilded',
        text: 'Gilded',
      },
    ];

    var activityTitle = dropdownList.find((d) => {
      return d.activity === activity;
    }).text;

    var button = (
      <button className={'twirly after' + (this.state.opened ? ' opened' : '')}>
        { activityTitle }
      </button>
    );
    var opened = this.state.opened;

    return (
      <div className='TopSubnav'>
        <Dropdown app={ this.props.app } id={ this._id } button={ button } className='Dropdown-inline'>
          {
            dropdownList.map((d) => {
              return (
                <li className='Dropdown-li' key={`ua-subnav-${d.text}`}>
                  <a className='Dropdown-button' href={ this.buildUrl(baseUrl, d.activity, this.state.sort, this.state.page) }>
                    <CheckmarkIcon played={ opened && activity === d.activity }/>
                    <span className='Dropdown-text'>{ d.text }</span>
                  </a>
                </li>
              );
            })
          }
        </Dropdown>

        <span className='text-muted'> sorted by </span>

        <SortDropdown
          app={ this.props.app }
          sort={ this.state.sort }
          list={ sortList }
          baseUrl={ this.buildUrl(baseUrl, this.state.activity) }
          className='Dropdown-inline'
        />
      </div>
    );
  }
}

function UserActivitySubnavFactory(app) {
  Dropdown = DropdownFactory(app);
  SortDropdown = SortDropdownFactory(app);
  CheckmarkIcon = CheckmarkIconFactory(app);
  return app.mutate('core/components/UserActivitySubnav', UserActivitySubnav);
}

export default UserActivitySubnavFactory;