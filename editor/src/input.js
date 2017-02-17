import React from 'react';
import {Form, TextArea} from 'semantic-ui-react';

export default function Input() {
    return (
        <Form>
            <TextArea placeholder='Try adding multiple lines' autoHeight/>
        </Form>
    )
}