import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import StopWatch from "./Components/StopWatch"
import TasksFinished from "./Components/TasksFinished/index";

class App extends Component {

	constructor(props) {
		super(props);

		this.state = this.initialState = {
			tasksFinished: [],
			currentPage: 1,
			tasksPerPage: 10
		};

		for (let method of ["handleClick", "handlerUpdateTasks"]) {
			this[method] = this[method].bind(this);
		}
	}

	search = (value) => {
		let route = value ? `/api/search/${value}` : "/api/tasks/";
		this.callApi(route)
			.then(res => {
					this.setState({tasksFinished: res});
					if(!res.length) console.warn('Nothing found!');
				}
			)
			.catch(err => console.log(err));
	};

	handleClick(event) {
		this.setState({
			currentPage: Number(event.target.id)
		});
	}

	handlerUpdateTasks() {
		this.callApi('/api/tasks')
			.then(res =>
				this.setState({tasksFinished: res})
			)
			.catch(err => console.log(err));
	};

	componentDidMount() {
		this.handlerUpdateTasks();
	}

	callApi = async (route) => {
		const response = await fetch(route);
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};

	render() {
		const {tasksFinished, currentPage, tasksPerPage } = this.state;

		// Logic for displaying current todos
		const indexOfLastTask = currentPage * tasksPerPage;
		const indexOfFirstTask = indexOfLastTask - tasksPerPage;
		const currentTasks = tasksFinished.slice(indexOfFirstTask, indexOfLastTask);

		// Logic for displaying page numbers
		const pageNumbers = [];
		for (let i = 1; i <= Math.ceil(tasksFinished.length / tasksPerPage); i++) {
			pageNumbers.push(i);
		}

		const renderPageNumbers = pageNumbers.map(number => {
			return (
				<li
					className={(number === this.state.currentPage)? 'active': 'average'}
					key={number}
					id={number}
					onClick={this.handleClick}
				>
					{number}
				</li>
			);
		});

		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h1 className="App-title">Welcome to React</h1>
				</header>

				<StopWatch fireAction={this.handlerUpdateTasks} />

				<div>
					<input
						type="search"
						id="search"
						placeholder="search by description"
						onChange={(evt)=> {
							let charLen = evt.target.value.length;
							if(charLen > 3 || charLen === 0)
								this.search(evt.target.value)
							}
						}
					/>
					<button
						onClick={
							(evt) => this.search(evt.target.previousElementSibling.value)
						}
					>Search</button>
				</div>

				{this.state.tasksFinished.length > 0 && <TasksFinished tasksFinished={currentTasks} pageStep={(this.state.currentPage-1) * this.state.tasksPerPage}/>}

				<ul id="page-numbers">
					{renderPageNumbers}
				</ul>

			</div>
		)
	}
}

export default App;
