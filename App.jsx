import React from './core/React.js';

function Counter({ num }) {
    return <div>计数器: {num}</div>
}

function CounterContainer() {
    return <Counter />
}

const App = (
    <div>
        <h1>mini-React-Demo🦊</h1>
        {/* <CounterContainer /> */}
        <Counter num={0} />
        <Counter num={10} />

    </div>
)

export default App;