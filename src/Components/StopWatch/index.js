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

const date = (time) => {
	let today = new Date(time),
		dd = today.getDate(),
		mm = today.getMonth() + 1, //January is 0!
		yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}
	return mm + '/' + dd + '/' + yyyy;
};

class StopWatch extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState = {
			isWorking: false,
			tasksFinished: [],
			timeElapsed: 0,
			description: '',
			startDate: null
		};

		for (let method of ["logTask", "update", "reset", "toggle", "onUserHasSetTime"]) {
			this[method] = this[method].bind(this);
		}
	}

	/*setTime Manually*/
	onUserHasSetTime = (value) => {
		this.setState({timeElapsed: value});
	};

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
		const {tasksFinished, timeElapsed, description, startDate} = this.state;
		this.setState({
			tasksFinished: tasksFinished.concat({
				time: timeElapsed,
				description: description,
				/*when setting time manually*/
				startDate: startDate || date(Date.now()),
				endDate: date(Date.now())
			}),
			startDate: null,
			timeElapsed: 0,
			isWorking: false,
			setTime: '',
			description: ''
		});
		clearInterval(this.timer);
	}

	/*Set timer to 0, initialState*/
	reset() {
		clearInterval(this.timer);
		this.setState(this.initialState);
	}

	/*Run the timer*/
	startTimer() {

		this.startTime = Date.now();
		/*The minimum delay, DOM_MIN_TIMEOUT_VALUE, is 4 ms
		 Tested google chrome
		 1st second worth 4 msec
		 2nd - 5th second worth 4 msec
		 6th - ... lim(infinity) ~ 2msec.
		 let k = 2 msec = 2 *10(-3)sec, where k - koef;
		 n = 1 / k  = 500, times error accure before 1sec inaccuracy occures;
		 timeWhenSecAdjustmentOccurs = ~~(n/60)+n%60 ~= 8 min 20 sec;
		 Taking into consideration that first few steps had a larger delay:
		 timeWhenSecAdjustmentOccurs = 8.19 sec.
		 */
		this.timer = setInterval(this.update, 1004);

		if (!this.state.startDate) {
			this.setState({startDate: date(this.startTime)});
		}
	}

	update() {
		const delta = Date.now() - this.startTime;
		this.setState({timeElapsed: this.state.timeElapsed + delta});
		this.startTime = Date.now();
	}

	render() {
		const {isWorking, tasksFinished, timeElapsed, setTime} = this.state;
		return (
			<div className="stopwatch">
				<TimeElapsed id="timer" timeElapsed={timeElapsed}/>
				{/*toggle play/stop/resume button*/}
				<button onClick={this.toggle} disabled={setTime}>
					{/*{isWorking ? 'Stop' : !timeElapsed ? 'Start' : 'Resume'}*/}

					{<span dangerouslySetInnerHTML={
						{__html: isWorking ? '&#9208;' : '&#x25ba;'}
					}>
					</span>}

				</button>
				{/*Reset button*/}
				<button onClick={this.reset} disabled={!isWorking && !timeElapsed}>
					{<span dangerouslySetInnerHTML={
						{__html: '&#9724;'}
					}>
					</span>}
				</button>
				{/*Save task time and reset timer to 00:00:00*/}
				<button onClick={this.logTask} disabled={!timeElapsed}>
					Save
				</button>
				{/*User able to set time*/}
				<div>
					<TimeInput action={this.onUserHasSetTime}/>
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
				{tasksFinished.length > 0 && <TasksFinished tasksFinished={tasksFinished}/>}
			</div>
		);
	}
}

class TimeInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState = {
			hr: 0,
			min: 0,
			sec: 0
		};

		for (let method of ['onChangeHandler', 'onSubmitHandler']) {
			this[method] = this[method].bind(this);
		}
	}

	/*setState property*/
	onChangeHandler = (property) => (evt) => {
		this.setState({[property]: evt.target.value});
	};

	reset() {
		this.setState(this.initialState);
	}

	onSubmitHandler = (property) => (evt) => {
		evt.preventDefault();
		/*time hr:min:sec converted to millisec*/
		let timeElapsed = 1000 * (Number(this.state.hr) * 3600 + Number(this.state.min) * 60 + Number(this.state.sec))
		/*pass time to parent component*/
		this.props.action(timeElapsed);
		/*reset to initial*/
		this.reset();
	};

	render() {
		return (
			<div className="set-time">
				{/*<form onSubmit={this.props.action} >*/}
				<form onSubmit={this.onSubmitHandler('timeElapsed')}>
					<input
						min="0"
						max="24"
						value={leftPad(2, this.state.hr)}
						type="number"
						onChange={this.onChangeHandler('hr')}
					/>:
					<input
						max="59"
						min="0"
						value={leftPad(2, this.state.min)}
						type="number"
						onChange={this.onChangeHandler('min')}
					/>:
					<input
						max="59"
						min="0"
						value={leftPad(2, this.state.sec)}
						type="number"
						onChange={this.onChangeHandler('sec')}
					/>
					<button disabled={!+this.state.hr && !+this.state.min && !+this.state.sec}>Set time</button>
				</form>
			</div>
		);
	}
}


class TimeElapsed extends React.Component {
	static getUnits(seconds) {
		return {
			hr: ~~(seconds / 3600),
			min: ~~((seconds / 60) % 60),
			sec: ~~(seconds % 60),
			msec: (seconds % 1).toFixed(3).substring(2)
		};
	}

	render() {
		const units = TimeElapsed.getUnits(this.props.timeElapsed / 1000);
		return (
			<div id={this.props.id}>
				<span>{leftPad(2, units.hr)}:</span>
				<span>{leftPad(2, units.min)}:</span>
				<span>{leftPad(2, units.sec)}</span>
				<span className="milliseconds">:{leftPad(2, units.msec)}</span>
			</div>
		);
	}
}

class TasksFinished extends React.Component {
	render() {
		const rows = this.props.tasksFinished.map((task, index) =>
			<tr key={++index}>
				<td>{index}</td>
				<td><TimeElapsed timeElapsed={task.time}/></td>
				<td>{task.description || 'default descr'}</td>
				<td>{task.startDate}</td>
				<td>{task.endDate}</td>
			</tr>
		);
		return (
			<table id="task-times">
				<thead>
				<tr>
					<th>Task</th>
					<th>TimeSpent</th>
					<th>Description</th>
					<th>Start Date</th>
					<th>End Date</th>
				</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	}
}

export default StopWatch;
