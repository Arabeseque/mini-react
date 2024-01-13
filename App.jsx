import React from './core/React.js';



const textEl = React.createTextNode('hello mini react');
const App = React.createElement('div', { id: 'app' }, textEl);

export default App;