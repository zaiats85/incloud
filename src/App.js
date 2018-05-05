import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import StopWatch from "./Components/StopWatch"
import TasksFinished from "./Components/TasksFinished/index";

class App extends Component {

	constructor(props) {
		super(props);

		this.state = this.initialState = {
			tasksFinished: []
		};

		this.handlerUpdateTasks = this.handlerUpdateTasks.bind(this);
	}

	handlerUpdateTasks() {
		this.callApi()
			.then(res =>
				this.setState({tasksFinished: res})
			)
			.catch(err => console.log(err));
	};

	componentDidMount() {
		this.handlerUpdateTasks();
	}

	callApi = async () => {
		const response = await fetch('/api/tasks');
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h1 className="App-title">Welcome to React</h1>
				</header>

				<StopWatch fireAction={this.handlerUpdateTasks} />

				<TasksFinished tasksFinished={this.state.tasksFinished} />

			</div>
		)
	}
}

export default App;
