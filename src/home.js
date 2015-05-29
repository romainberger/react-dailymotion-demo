import React from 'react'
import request from 'superagent'
import {Link} from 'react-router'
import Player from './player'

// cache for video components
const cache = {}

export default class Home extends React.Component {
    constructor() {
        super()
        this.state = {users: []}
    }
    componentWillMount() {
        request('GET', 'https://api.dailymotion.com/users?list=recommended&fields=username,avatar_720_url&limit=24')
            .send()
            .set('Accept', 'application/json')
            .end((err, res) => {
                this.setState({users: res.body.list})
            })
    }
    getUserDisplay(user) {
        if (typeof cache[user.username] === 'undefined') {
            cache[user.username] = this.props.user.list.map((video, i) => {
                return (
                    <div className="col-sm-1" key={i}>
                        <Link to="video" params={{id: user.username, videoId: video.id}}>
                            <img src={video.thumbnail_360_url} width="100%" />
                        </Link>
                    </div>
                )
            })
        }

        return cache[user.username]
    }
    getUserListChunk(users) {
        let userDisplay = null

        let list = users.map((user, i) => {
            let isCurrentUser = this.props.params.id === user.username
            let className = isCurrentUser ? 'current' : 'off'

            if (isCurrentUser) {
                userDisplay = this.getUserDisplay(user)
            }

            return (
                <div className="col-sm-2" key={i}>
                    <div>
                        <Link to="home" params={{id: user.username}}>
                            <img src={user.avatar_720_url} title={user.username} width="100%" />
                        </Link>
                    </div>
                </div>
            )
        })

        return {list: list, display: userDisplay}
    }
    getUsersList() {
        let users = [this.state.users.slice(0, 6), this.state.users.slice(6, 12), this.state.users.slice(12, 18), this.state.users.slice(18, 24)]
        let videoId = this.props.params.videoId ? this.props.params.videoId : this.props.user ? this.props.user.list[0].id: false

        return users.map((usersSet, i) => {
            let listChunk = this.getUserListChunk(usersSet)
            return (
                <div className="row user-row" key={i}>
                    <div className="col-sm-12">
                        <div className="row">
                            {listChunk.list}
                        </div>
                        <div className={'row user-display ' + (listChunk.display ? 'current' : '')}>
                            <div>{listChunk.display}</div>
                            {listChunk.display && videoId ? <Player id={videoId} /> : ''}
                        </div>
                    </div>
                </div>

            )
        })
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
