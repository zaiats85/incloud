import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import StopWatch from './Components/StopWatch';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
	<StopWatch />,
	document.getElementById('stopwatch')
);

registerServiceWorker();
