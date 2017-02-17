import React from 'react';
import {Container, Grid} from 'semantic-ui-react';
import AppMenu from './menu';
import Input from './input';
import Paragraph from './paragraph';

export default function Layout(props) {
    return (
        <div>
            <AppMenu></AppMenu>
            <Container>
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <Input></Input>
                        </Grid.Column>
                        <Grid.Column>
                            <Paragraph>Здравствуйте!</Paragraph>
                            <Paragraph>Недавно мне довелось провести какое-то время в Индии. Сидя в разных священных местах, я как мог прислушивался к себе, чтобы яснее понять, как мне наиболее плодотворно делать то, что я делаю, как наилучшим образом двигаться дальше и на какие свои ошибки сейчас нужно особенно обратить внимание. Естественно, чтобы получить ответы на эти вопросы, нужно на время перестать шуршать мыслями, и дать возможность молчанию и свету очистить тебя от всяческой суеты.
Иногда при этом на мгновение возникает очень ясное видение мира. И вот кое-чем из того, на что я обратил внимание, я и хочу сегодня с вами поделиться.
</Paragraph>
                            <Paragraph>Matt Molloy - Idir Deighric ‘Gus Breo’</Paragraph>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
    )
}