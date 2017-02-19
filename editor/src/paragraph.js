import React from 'react';
import {Dropdown, Segment, Label, Icon} from 'semantic-ui-react';
import TrackInfo from './trackinfo';

export default function Paragraph(props) {
    const tracks = [{
        uid: '1',
        trackName: 'Help!',
        artistName: 'The Beatles',
        thumb: 'http://lorempixel.com/30/30',
        year: '2001'
    }, {
        uid: '2',
        trackName: 'Hey Jude',
        artistName: 'The Beatles',
        thumb: 'http://lorempixel.com/30/30',
        year: '2001'
    }, {
        uid: '3',
        trackName: 'Yellow submarine',
        artistName: 'The Beatles',
        thumb: 'http://lorempixel.com/30/30',
        year: '2001'
    }]
    return (
        <Segment vertical>
            <div>{props.children}</div>
            {props.children.length < 80 ? (
                <div>
                <Label color='grey'>
                    <Icon name='apple' />
                    Hey Jude
                    <Label.Detail>The Beatles</Label.Detail>
                    <Icon name='delete' />
                </Label>
                <Label color='red'>
                    Hey Jude
                    <Label.Detail>The Beatles</Label.Detail>
                    <Icon name='delete' />
                </Label>
                <Dropdown inline text='Add track info'>
                    <Dropdown.Menu>
                        {tracks.map(track => <TrackInfo track={track} key={track.uid}/>)}
                    </Dropdown.Menu>
                </Dropdown>
                </div>
            ) : null}
        </Segment>
    )
}