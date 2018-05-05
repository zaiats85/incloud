import React from 'react';
import TimeElapsed from '../StopWatch/TimeElapsed'
import './tasksfinished.css';
import {date} from '../../helper'

class TasksFinished extends React.Component {
	render() {
		const rows = this.props.tasksFinished.map((task, index) =>
			<tr key={++index}>
				<td>{index}</td>
				<td><TimeElapsed timeElapsed={task.time}/></td>
				<td>{task.description || 'default descr'}</td>
				<td>{date(new Date(task.startDate)) || 'no date'}</td>
				<td>{date(new Date(task.endDate)) || 'no date'}</td>
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

export default TasksFinished