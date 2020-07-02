import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import global from './global'

document.addEventListener('astilectron-ready', function() {
    window.astilectron.onMessage(function(message) {
        if (global["handlers"][message.name] != null) {
            global["handlers"][message.name](message.payload);
        }
    });
});

ReactDOM.render(<App />, document.getElementById('root'));
