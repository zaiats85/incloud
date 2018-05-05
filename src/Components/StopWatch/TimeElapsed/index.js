import React from 'react';
import './timeelapsed.css';
import {leftPad} from '../../../helper'

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

export default TimeElapsed