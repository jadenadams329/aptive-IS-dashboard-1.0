import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
	return (
		<div className='sidebar'>
			<ul>
				<li>
					<NavLink to='/sales-tracker'>Sales Tracker</NavLink>
				</li>
			</ul>
		</div>
	);
}

export default Sidebar;
