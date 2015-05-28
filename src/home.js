import React from 'react'
import request from 'superagent'
import {Link} from 'react-router'

// cache for video components
const cache = {}

export default class Home extends React.Component {
    constructor() {
        super()
        this.state = {users: []}
    }
    componentWillMount() {
        request('GET', 'https://api.dailymotion.com/users?list=recommended&fields=username,avatar_360_url&limit=24')
            .send()
            .set('Accept', 'application/json')
            .end((err, res) => {
                this.setState({users: res.body.list})
            })
    }
    getUserDisplay(id) {
        if (typeof cache[id] === 'undefined') {
            cache[id] = this.props.user.list.map((video, i) => {
                return (
                    <div className="col-md-1" style={this.style.video} key={i}>
                        <img src={video.thumbnail_360_url} style={this.style.thumbnail} />
                    </div>
                )
            })
        }

        return cache[id]
    }
    getUserListChunk(users) {
        let userDisplay = null

        let list = users.map((user, i) => {
            let isCurrentUser = this.props.params.id === user.username
            let className = isCurrentUser ? 'current' : 'off'

            if (isCurrentUser) {
                userDisplay = this.getUserDisplay(user.username)
            }

            return (
                <div className="col-md-2" key={i}>
                    <div>
                        <Link to="home" params={{id: user.username}}>
                            <img src={user.avatar_360_url} title={user.username} width="100%" />
                        </Link>
                    </div>
                </div>
            )
        })

        return {list: list, display: userDisplay}
    }
    getUsersList() {
        let users = [this.state.users.slice(0, 6), this.state.users.slice(6, 12), this.state.users.slice(12, 18), this.state.users.slice(18, 24)]

        return users.map((usersSet, i) => {
            let listChunk = this.getUserListChunk(usersSet)
            return (
                <div className="row" key={i}>
                    <div className="col-md-12">
                        <div className="row">
                            {listChunk.list}
                        </div>
                        <div className={'row user-display ' + (listChunk.display ? 'current' : '')}>
                            {listChunk.display}
                        </div>
                    </div>
                </div>

            )
        })
    }
    get style() {
        return {
            video: {
                display: 'inline-block',
                height: 169,
                marginRight: 20,
                overflow: 'hidden'
            },
            thumbnail: {
                width: '100%'
            }
        }
    }
    render() {
        return (
            <div>
                {this.getUsersList()}
            </div>
        )
    }
}

Home.propTypes = {params: React.PropTypes.object, user: React.PropTypes.object}
