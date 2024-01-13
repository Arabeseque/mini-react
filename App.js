import React from './core/React.js';

const text = {
    type: 'TEXT_ELEMENT',
    props: {
        nodeValue: 'hello mini react',
        children: []
    }
}

const el = {
    type: 'div',
    props: {
        id: 'app',
        children: [
            text
        ]
    }
}


const textEl = React.createTextNode('hello mini react');
const App = React.createElement('div', { id: 'app' }, textEl);

export default App;