const React = require('react')
const ReactDOM = require('react-dom')
const Layout = require('./views/layout')
const Menu = require('./views/menu')
const Paragraph = require('./views/paragraph')
const TextArea = require('semantic-ui-react').TextArea


class BaseComponent extends React.Component {
    constructor(props) {
        super(props);
        this._subscriptions = [];
    }
    componentWillUnmount() {
        this._subscriptions.forEach(s => s.unsubscribe());
    }
    subscribeState(observable, key) {
        this._subscriptions.push(observable.subscribe(data => {
            this.setState({[key]: data});
        }));
    }
}

class Input extends React.Component {
    render () {
        return (
            <form className="ui form">
                <TextArea placeholder='Try adding multiple lines' autoHeight/>
            </form>
        )
    }
}

class Output extends React.Component {
    
    render () {
        const paragraphs = [
            'Здравствуйте!',
            'Однажды Суровый Аль-Фаррахи сидел на главной площади, и люди, увидев его, шептали: “Вот сидит великий святой Суровый Аль-Фаррахи”, и обходили его стороной, потому что, помимо своих знаний и мудрости, он был известен еще тяжелым нравом, и за неверное слово можно было получить по голове. И только один юноша, видимо пришедший из другого города, увидел святого и направился прямо к нему за благословением. А Суровый Аль-Фаррахи, на самом деле, ужасно страдал от своей репутации, ему не нравилось, что его все обходят стороной, ему хотелось просто поговорить. Он пригласил мальчика сесть, налил ему чая и сказал: “Расскажи мне то, чего я не знаю”. Вот этим мы сегодня и займемся.',
            'Matt Bianco - Ordinary Day',
            'Это были “Matt Bianco” - британская группа, пользовавшаяся огромной популярностью в Европе в 80-е годы. Их музыка - сочетание латино, джаза и чего-то еще, чего я никак не могу назвать… Может быть, легкость, юмор? Певец и фронтмен Марк Рэйли поясняет: “Матт Бьянко - это не мой псевдоним и не я, это выдуманный нами секретный агент”. А музыка при этом ужасно симпатичная. А вот еще один человек, с не менее симпатичной музыкой, - зовут его Ману Чао. Он начинал еще подростком, играя на гитаре на улицах Парижа, он поет на французском, английском, испанском, арабском, каталанском, галицийском и еще массе других языков - настоящий человек мира. Он и антиглобалист, и за права женщин, и за права окружающей среды - за все, за что надо. И музыка его тоже не умещается в один стиль, он смешивает все вместе и получается точно, как надо. Историк панка и регге Вивьен Голдман пишет: “Ману Чао передает сам дух панка. Он, может быть, вообще самый панк из всех, кого я знаю. Его дух заставляет его заботиться и думать обо всех людях - вот это и есть панк”. '
        ]
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
            <div>
                Output!
                {paragraphs.map((p, index) => <Paragraph key={index} content={p} tracks={p.length < 80 ? tracks : null} />)}
            </div>
        )
    }
}

class App extends React.Component {
    render() {
        return (
            <Layout menu={<Menu />} input={<Input />} output={<Output />} />
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));