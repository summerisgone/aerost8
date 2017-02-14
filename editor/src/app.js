import React from 'react';
import ReactDOM from 'react-dom';
import rx from 'rxjs';
import styles from './main.css';

const contentSubj = new rx.BehaviorSubject('');

class InputArea extends React.Component {
    render() {
        return (
            <textarea ref="textarea" className={styles.textarea} onChange={this.changeHandler}></textarea>
        );
    }
    changeHandler(e) {
        const text = e.target.value;
        contentSubj.next(text);
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
            {
                this.state.text.split('\n').map((paragraph, i) => {
                    return (<p key={i}>{paragraph}</p>);
                })
            }
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