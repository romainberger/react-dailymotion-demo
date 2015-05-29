import React from 'react'

export default class Player extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.id !== nextProps.id
    }
    render() {
        return (
            <div className="player-wrapper" style={{color: 'white'}}>
                <iframe src={`http://dailymotion.com/embed/video/${this.props.id}`} />
            </div>
        )
    }
}

Player.propTypes = {id: React.PropTypes.string}
