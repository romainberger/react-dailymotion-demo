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
        request('GET', 'https://api.dailymotion.com/users?list=recommended&fields=username,avatar_360_url&limit=12')
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
                    <div style={this.style.video} key={i}>
                        <img src={video.thumbnail_360_url} style={this.style.thumbnail} />
                    </div>
                )
            })
        }

        return cache[id]
    }
    getUserListChunk(users) {
        return users.map((user, i) => {
            let isCurrentUser = this.props.params.id === user.username
            let className = isCurrentUser ? 'current' : 'off'

            return (
                <div key={i} style={this.style.userRow}>
                    <div>
                        <Link to="home" params={{id: user.username}}>
                            <img src={user.avatar_360_url} title={user.username} />
                        </Link>
                    </div>
                    <div className={`user-display ${className}`}>
                        {isCurrentUser ? this.getUserDisplay(user.username) : ''}
                    </div>
                </div>
            )
        })
    }
    getUsersList() {
        let users = [this.state.users.slice(0, 4), this.state.users.slice(4, 8), this.state.users.slice(8, 12)]

        return users.map((usersSet, i) => {
            return (
                <div key={i}>
                    {this.getUserListChunk(usersSet)}
                </div>
            )
        })
    }
    get style() {
        return {
            video: {
                display: 'inline-block',
                width: 300,
                height: 169,
                marginRight: 20,
                overflow: 'hidden'
            },
            thumbnail: {
                width: '100%'
            },
            userRow: {
                display: 'inline-block'
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
