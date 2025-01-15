import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "../ProfileButton/ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);

	const sessionLinks = sessionUser ? (
		<li>
			<ProfileButton user={sessionUser} />
		</li>
	) : (
		<div className='navbar-links'>
			<li>
				<NavLink to='/login'>Log In</NavLink>
			</li>
			<li>
				<NavLink to='/signup'>Sign Up</NavLink>
			</li>
		</div>
	);
	return (
		<>
			<nav className='navbar'>
				<div className='navbar-center'>LOGO</div>
				<div className='navbar-right'>
					<ul>{isLoaded && sessionLinks}</ul>
				</div>
			</nav>
		</>
	);
}

export default Navigation;
