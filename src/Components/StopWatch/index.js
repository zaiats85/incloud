import React from 'react';
import TimeInput from './TimeInput'
import TimeElapsed from './TimeElapsed'
import './stopwatch.css';
import {date} from '../../helper'

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

	saveTask = async () => {
		const {timeElapsed, description, startDate} = this.state;
		const response = await fetch('/api/add-task/', {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},

			body: JSON.stringify({
				time: timeElapsed,
				description: description,
				/*when setting time manually*/
				startDate: startDate || date(Date.now()),
				endDate: date(Date.now())
			})

		});
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};

	/*Must be save*/
	logTask() {
		this.saveTask()
			.then((res) => {
				this.props.fireAction();
				this.reset();

			})
			.catch(err => console.log(err));
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
		const {isWorking, timeElapsed, setTime} = this.state;
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
				{/*{tasksFinished.length > 0 && <TasksFinished tasksFinished={tasksFinished}/>}*/}
			</div>
		);
	}
}

export default StopWatch;
