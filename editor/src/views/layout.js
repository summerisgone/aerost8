const React = require('react')

Layout.propTypes = {
    input: React.PropTypes.element,
    output: React.PropTypes.element,
    menu: React.PropTypes.element
}
function Layout(props) {
    return (
        <div>
            {props.menu}
            <div className="ui two column grid container">
                <div className="column">
                    {props.input}
                </div>
                <div className="column">
                    {props.output}
                </div>
            </div>
        </div>
    )
}
module.exports = Layout