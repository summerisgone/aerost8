const React = require('react')
const Dropdown = require('semantic-ui-react').Dropdown
const styles = require('./trackinfo.css')


function TrackInfo(props) {
    return (
        <Dropdown.Item>
            <div className={styles.trackinfo}>
                <img className={styles.thumbnail} src={props.track.thumb} alt="props.track.trackName"/>
                <div className={styles.track}>
                    <div className={styles.trackTitle}>{props.track.trackName}</div>
                    <div className={styles.artistName}>{props.track.artistName}</div>
                    <div className={styles.album}>{props.track.album}</div>
                </div>
                <div className={styles.release}>
                    {props.track.year}
                </div>
            </div>
        </Dropdown.Item>
    )
}
module.exports = TrackInfo