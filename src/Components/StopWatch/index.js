import React from 'react';
import './stopwatch.css';

/*Detect how many zeros to show*/
const leftPad = (width, n) => {
	if ((n + '').length > width) {
		return n;
	}
	const padding = new Array(width).join('0');
	return (padding + n).slice(-width);
};

class StopWatch extends React.Component {
	constructor(props) {
		super(props);

		this.state = this.initialState = {
			isWorking: false,
			taskTimes: [],
			timeElapsed: 0,
			description: '',
			setTime: "",
			startDate: null,
			endDate: null
		};

		for (let method of ["logTask", "update", "reset", "toggle"]) {
			this[method] = this[method].bind(this);
		}
	}

	/*setState property*/
	onChangeHandler = (property) => (evt) => {
		this.setState({[property]: evt.target.value});
	};

	/*switch between start/stop buttons*/
	toggle() {
		this.setState({isWorking: !this.state.isWorking}, () => {
			this.state.isWorking ? this.startTimer() : clearInterval(this.timer)
		});
	}

	/*Must be save*/
	logTask() {
		const {taskTimes, timeElapsed, description} = this.state;

		const a = taskTimes.concat({
			time: timeElapsed,
			description: description,
			date: new Date().getDate()
		});

		console.log(a);

		this.setState(a);
	}

	/*Set timer to 0*/
	reset() {
		clearInterval(this.timer);
		this.setState(this.initialState);
	}

	/*Run the timer*/
	startTimer() {
		this.startTime = Date.now();
		this.timer = setInterval(this.update, 10);
	}

	update() {
		const delta = Date.now() - this.startTime;
		this.setState({timeElapsed: this.state.timeElapsed + delta});
		this.startTime = Date.now();
	}

	render() {
		const {isWorking, taskTimes, timeElapsed, description} = this.state;
		return (
			<div className="stopwatch">
				<TimeElapsed id="timer" timeElapsed={timeElapsed}/>
				{/*toggle play/stop/resume button*/}
				<button onClick={this.toggle}>
					{isWorking ? 'Stop' : !timeElapsed ? 'Start' : 'Resume'}
				</button>
				{/*Reset button*/}
				<button onClick={this.reset} disabled={!isWorking && !timeElapsed}>
					Reset
				</button>
				{/*Save task time and reset timer to 00:00:00*/}
				<button onClick={this.logTask} disabled={!timeElapsed}>
					Log Time
				</button>
				{/*User able to set time*/}
				<div>
					<input
						className='set-time'
						value={this.state.setTime}
						onChange={this.onChangeHandler('setTime')}
						placeholder='you might set time manually'
					/>
				</div>
				{/*Give task description*/}
				<div>
					<textarea
						className='description'
						placeholder="Describe ur task"
						value={this.state.description}
						onChange={this.onChangeHandler('description')}
					/>
				</div>
				{taskTimes.length > 0 && <TaskTimes taskTimes={taskTimes}/>}
			</div>
		);
	}
}

class TimeElapsed extends React.Component {
	getUnits() {
		const seconds = this.props.timeElapsed / 1000;
		return {
			hr: ~~(seconds / 3600),
			min: ~~(seconds / 60),
			sec: ~~(seconds % 60),
			msec: (seconds % 1).toFixed(3).substring(2)
		};
	}

	render() {
		const units = this.getUnits();
		return (
			<div id={this.props.id}>
				<span>{leftPad(2, units.hr)}:</span>
				<span>{leftPad(2, units.min)}:</span>
				<span>{leftPad(2, units.sec)}:</span>
				<span>{leftPad(2, units.msec)}</span>
			</div>
		);
	}
}

class TaskTimes extends React.Component {
	render() {
		console.log(this);
		const rows = this.props.taskTimes.map((taskTime, index) =>
			<tr key={++index}>
				<td>{index}</td>
				<td><TimeElapsed timeElapsed={taskTime}/></td>
				<td>Description</td>
			</tr>
		);
		return (
			<table id="task-times">
				<thead>
				<tr>
					<th>Lap</th>
					<th>Time</th>
					<th>Description</th>
					<th>Date</th>
				</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	}
}

export default StopWatch;
