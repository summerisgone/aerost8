import React from 'react';
import ReactDOM from 'react-dom';
import rx from 'rxjs';
import fetchJsonp from 'fetch-jsonp'
import styles from './main.css';
import {Popover, Overlay, Button} from 'react-bootstrap';

const contentSubj = new rx.BehaviorSubject(`Здравствуйте!

Уж больше 10 лет четыре раза в год мы делаем особый выпуск Аэростата, посвященный четырем древним кельтским (а может быть, и докельтским) праздникам, расставленным по четырем стратегическим точкам года - 1 февраля, 1 мая, 1 августа и 1 ноября. Соответственно, завтра после заката солнца начинается самый опасный из них - Соуэн.

Steeleye Span - The Blacksmith

Соуэн - опасное время, потому что, по преданию, в этот день преграда, отделяющая другой мир от мира нашего, предельно истончается, и обитатели потусторонних краев оказываются способны странствовать по нашему миру и творить в нем то, что хотят; а человек может выйти из дома, заблудиться и попасть туда, откуда вернуться нелегко.

И контакты с тем миром в Соуэн тоже оказываются установить проще, чем обычно. Вот как в этой старинной английской песне, где герой на могиле своей возлюбленной вступает с ней в беседу, и она ему много что объясняет о метафизике взаимодействия между мирами.

Gryphon - Unquiet Grave`);

class InputArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }
    componentDidMount() {
        this._value = contentSubj.subscribe(text => this.setState({value: text}));
    }
    componentWillUnmount() {
        this._value.unsubscribe();
    }
    render() {
        return (
            <textarea ref="textarea" value={this.state.value} className={styles.textarea} onChange={this.changeHandler}></textarea>
        );
    }
    changeHandler(e) {
        const text = e.target.value;
        contentSubj.next(text);
    }
}

class SelectTrackPopover extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.showPopover = this.showPopover.bind(this);
        this.hidePopover = this.hidePopover.bind(this);
        this.state = {
            results: [],
            show: false
        };
    }
    showPopover() {
        this.setState({
            show: true
        });
    }
    hidePopover() {
        this.setState({
            show: false
        });
    }
    search() {
        const term = this.props.term;
        fetchJsonp(`https://itunes.apple.com/search?term=${this.props.term}&callback=callback`)
        .then(response => response.json())
        .then(json => {
            this.setState({
                results: json.results
            });
        })
        .catch(ex => {
            console.log('parsing failed', ex);
        });
    }
    handleClick(result) {
        return (e) => {
            this.props.handleSelect(result);
            this.hidePopover();
        }
    }
    render() {
        const hasResults = this.state.results.length > 0;
        return (
            <div style={{position: 'relative'}}>
                <Button ref="target" onClick={this.showPopover}>{this.props.children}</Button>
                <Overlay
                    show={this.state.show}
                    placement="bottom"
                    containerPadding={20}
                    rootClose={true}
                    onEnter={this.search}
                    onHide={() => this.setState({ show: false })}
                    target={() => ReactDOM.findDOMNode(this.refs.target)}
                    >
                    <Popover title="Select track"
                            id={this.props.id}>
                        <ul className="list-group">
                        {hasResults ? (this.state.results.map((result, i) => {
                            return (
                                <li className="list-group-item"
                                    onClick={this.handleClick(result)}
                                    key={i}>
                                    <img src={result.artworkUrl30} alt="album"/>
                                    {result.artistName}
                                    <strong>{result.trackName}</strong>
                                </li>
                            );
                        })) : (<li className="list-group-item">loading...</li>) }
                        </ul>
                    </Popover>
                </Overlay>
            </div>
        )
    }
}

class Paragraph extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }
    handleSelect(trackData) {
        console.log('selected', trackData);
    }
    render() {
        return (
            <div>
                {this.props.text}
                {(this.props.text.trim().length > 0 && this.props.text.trim().length < 80)
                    ? (
                        <SelectTrackPopover term={this.props.text.trim()}
                                            id={`popover_${this.props.id}`}
                                            handleSelect={this.handleSelect}>+</SelectTrackPopover>
                    )
                    : null
                }
            </div>
        )
    }
}

class RenderArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }
    componentDidMount() {
        this._text = contentSubj.subscribe(text => this.setState({text: text}));
    }
    componentWillUnmount() {
        this._text.unsubscribe();
    }
    render() {
        return (
            <div>
                {this.state.text.split('\n').map((paragraph, i) => {
                    return (
                        <Paragraph key={i} id={`paragraph_${this.props.id}`} text={paragraph}></Paragraph>
                    );
                })}
            </div>
        )
    }
}

class Layout extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className="col-md-12">
                    <h1>Text Entity Extractor</h1>
                </div>
                <div className={styles.innerContainer}>
                    <div className="col-md-6">
                        <InputArea></InputArea>
                    </div>
                    <div className="col-md-6">
                        <RenderArea></RenderArea>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <div>
    <Layout></Layout>
</div>, document.getElementById('app'));