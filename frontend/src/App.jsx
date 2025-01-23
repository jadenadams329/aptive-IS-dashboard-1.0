// import {Routes, Route } from 'react-router-dom'
// import Navigation from './components/common/Navigation';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage/SignupFormPage";
import Navigation from "./components/Navigation/Navigation";
import SalesTrackerPage from "./components/SalesTrackerPage/SalesTrackerPage";
import * as sessionActions from "./store/session";
import "./App.css";

function Layout() {
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(sessionActions.restoreUser()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	return (
		<div className='app-container'>
			{/* Top navigation bar */}
			<Navigation isLoaded={isLoaded} />

			{/* Main content row below the navbar */}
			<div className='main-content'>
				<div className='outlet-container'>{isLoaded && <Outlet />}</div>
			</div>
		</div>
	);
}

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <h1>Welcome!</h1>,
			},
			{
				path: "/login",
				element: <LoginFormPage />,
			},
			{
				path: "/signup",
				element: <SignupFormPage />,
			},
			{
				path: "/sales-tracker",
				element: <SalesTrackerPage />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
