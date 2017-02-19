import React from 'react';
import {Dropdown} from 'semantic-ui-react';
import styles from './trackinfo.css';

export default function Paragraph(props) {
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