import React from './React.js';

const ReactDOM = {
    createRoot: container => ({
        render: el => {
            container.innerHTML = '';
            React.render(el, container);
        }
    })
}

export default ReactDOM;