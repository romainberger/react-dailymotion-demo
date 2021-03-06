import React from 'react'
import {default as Router, Route, RouteHandler, Link} from 'react-router'
import Home from './home'
import getUserInfos from './get-user-infos'

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <RouteHandler user={this.props.user} />
            </div>
        )
    }
}

const routes = (
    <Route handler={App} ignoreScrollBehavior={true}>
        <Route name="home" path="/:id?" handler={Home}/>
        <Route name="video" path="/:id/:videoId" handler={Home}/>
    </Route>
)

Router.run(routes, function(Handler, state) {
    getUserInfos(state.params.id).then((res) => {
        React.render(<Handler user={res} />, document.body)
    })
})
