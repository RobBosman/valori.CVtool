'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function ErrorPage(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h2',
            null,
            'Error...'
        )
    );
}

function TitleCerios(props) {
    return React.createElement(
        'strike',
        {className: 'cerios'},
        'Cerios'
    );
}

function TitleValori(props) {
    return React.createElement(
        'span',
        {className: 'valori'},
        'VALORI'
    );
}

function TitleCVtool(props) {
    return React.createElement(
        'span',
        null,
        React.createElement(TitleCerios, null),
        ' ',
        React.createElement(TitleValori, null),
        ' CVtool'
    );
}

var LoginPage = function (_React$Component) {
    _inherits(LoginPage, _React$Component);

    function LoginPage(props) {
        _classCallCheck(this, LoginPage);

        var _this = _possibleConstructorReturn(this, (LoginPage.__proto__ || Object.getPrototypeOf(LoginPage)).call(this, props));

        _this.handleAanmelden = function (event) {
            _this.props.onChange('logging-in');
        };

        return _this;
    }

    _createClass(LoginPage, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                {align: 'center'},
                React.createElement(
                    'h1',
                    null,
                    'Welkom bij de ',
                    React.createElement(TitleCVtool, null),
                    '!'
                ),
                React.createElement(
                    'p',
                    null,
                    'Om de CVtool te gebruiken moet je je aanmelden met je ',
                    React.createElement(TitleValori, null),
                    ' account.',
                    React.createElement('br', null),
                    'Tijdens het inlogproces controleert de CVtool je account, je moet daar eenmalig toestemming voor geven.'
                ),
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        'a',
                        {href: 'https://account.activedirectory.windowsazure.com/r/#/applications', target: 'blank'},
                        'Hier'
                    ),
                    ' kun je die toestemming bekijken en eventueel weer intrekken.',
                    React.createElement('br', null),
                    'Als je de \'',
                    React.createElement(
                        'em',
                        null,
                        'Cerios (Valori) CVtool'
                    ),
                    ' app verwijdert blijven je CV-gegevens bewaard. Na opnieuw inloggen (en toestemming verlenen) kun je daar weer bij.'
                ),
                React.createElement(
                    'p',
                    null,
                    'Problemen? ',
                    React.createElement(
                        'a',
                        {href: 'mailto:RobBosman@valori.nl', target: 'blank'},
                        'Mail'
                    ),
                    ' even!'
                ),
                React.createElement(
                    'button',
                    {onClick: this.handleAanmelden},
                    'Aanmelden'
                )
            );
        }
    }]);

    return LoginPage;
}(React.Component);

var MainApp = function (_React$Component2) {
    _inherits(MainApp, _React$Component2);

    function MainApp(props) {
        _classCallCheck(this, MainApp);

        var _this2 = _possibleConstructorReturn(this, (MainApp.__proto__ || Object.getPrototypeOf(MainApp)).call(this, props));

        _this2.handleAppStateChange = function (value) {
            _this2.setState({
                appState: value
            });

            if (value === 'logging-in') {
                _this2.timerID = setTimeout(function () {
                    _this2.handleAppStateChange('logged-in');
                }, 2000);
            } else if (value === 'logged-in') {
                _this2.timerID = setTimeout(function () {
                    _this2.handleAppStateChange('logged-out');
                }, 3000);
            }
        };

        _this2.state = {
            appState: 'logged-out'
        };
        return _this2;
    }

    _createClass(MainApp, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.timerID);
        }
    }, {
        key: 'render',
        value: function render() {
            switch (this.state.appState) {
                case 'logged-out':
                    return React.createElement(LoginPage, {onChange: this.handleAppStateChange});
                case 'logging-in':
                    return React.createElement(
                        'span',
                        null,
                        'logging in...'
                    );
                case 'logged-in':
                    return React.createElement(
                        'span',
                        null,
                        'logged in'
                    );
                default:
                    return React.createElement(ErrorPage, null);
            }
        }
    }]);

    return MainApp;
}(React.Component);

ReactDOM.render(React.createElement(MainApp, null), document.getElementById('root'));