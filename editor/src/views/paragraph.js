const React = require('react')
const Dropdown = require('semantic-ui-react').Dropdown
const TrackInfo = require('./trackinfo')

Paragraph.propTypes = {
    content: React.PropTypes.string,
    tracks: React.PropTypes.array,
}
function Paragraph(props) {
    return (
        <div className="ui segment vertical">
            <div>{props.content}</div>
            {props.tracks ? (
                <div>
                <div className="ui grey label">
                    <i className="apple icon"></i>
                    Hey Jude
                    <div className="detail">The Beatles</div>
                    <i className="delete icon"></i>
                </div>
                <div className="ui red label">
                    Hey Jude
                    <div className="detail">The Beatles</div>
                    <i className="delete icon"></i>
                </div>
                <Dropdown inline text='Add track info'>
                    <Dropdown.Menu>
                        {props.tracks.map(track => <TrackInfo track={track} key={track.uid}/>)}
                    </Dropdown.Menu>
                </Dropdown>
                </div>
            ) : null}
        </div>
    )
}

module.exports = Paragraph