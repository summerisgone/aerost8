import React from 'react';
import {Button, Icon, Divider} from 'semantic-ui-react';

export default function Paragraph(props) {
    console.log(props.children);
    return (
        <div>
            {props.children.length < 80 ? (
                <Button attached={'right'} icon>
                    <Icon name='plus' />
                </Button>
            ) : null}
            <p>{props.children}</p>
            <Divider />
        </div>
    )
}