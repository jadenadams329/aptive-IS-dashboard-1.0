import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import * as sessionActions from "../../store/session";

function SignupFormPage() {
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});

	if (sessionUser) return <Navigate to='/' replace={true} />;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			setErrors({});
			return dispatch(
				sessionActions.signup({
					email,
					username,
					name,
					role,
					password,
				})
			).catch(async (res) => {
				const data = await res.json();
				if (data?.errors) {
					setErrors(data.errors);
				}
			});
		}
		return setErrors({
			confirmPassword: "Confirm Password field must be the same as the Password field",
		});
	};

	return (
		<>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Email
					<input type='text' value={email} onChange={(e) => setEmail(e.target.value)} required />
				</label>
				{errors.email && <p>{errors.email}</p>}
				<label>
					Username
					<input type='text' value={username} onChange={(e) => setUsername(e.target.value)} required />
				</label>
				{errors.username && <p>{errors.username}</p>}
				<label>
					Full Name
					<input type='text' value={name} onChange={(e) => setName(e.target.value)} required />
				</label>
				{errors.name && <p>{errors.name}</p>}
				<label>
					Role
					<select value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value=''>Please select a role</option>
                        <option value='manager'>Manager</option>
                        <option value='closer'>Closer</option>

                    </select>
				</label>
				{errors.lastName && <p>{errors.lastName}</p>}
				<label>
					Password
					<input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
				</label>
				{errors.password && <p>{errors.password}</p>}
				<label>
					Confirm Password
					<input
						type='password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				{errors.confirmPassword && <p>{errors.confirmPassword}</p>}
				<button type='submit'>Sign Up</button>
			</form>
		</>
	);
}

export default SignupFormPage;
