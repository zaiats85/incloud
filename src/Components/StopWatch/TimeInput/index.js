import React from 'react';
import './timeinput.css';
import {leftPad} from '../../../helper'

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
export default TimeInput