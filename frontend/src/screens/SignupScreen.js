import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SignupScreen() {
	const navigate = useNavigate();
	const { search } = useLocation();
	const redirectInUrl = new URLSearchParams(search).get("redirect");
	const redirect = redirectInUrl ? redirectInUrl : "/";

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [number,setNumber] = useState('');
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword){
			toast.error('Passwords do not match');
			return;
		}
		try {
			const { data } = await Axios.post("/api/users/signup", {
				name,
				email,
				number,
				password,
			});
			ctxDispatch({ type: "USER_SIGNIN", payload: data });
			localStorage.setItem("userInfo", JSON.stringify(data));
			navigate(redirect || "/");
		} catch (err) {
			toast.error(getError(err));
		}
	};

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	return (
		<Container className="small-container">
			<Helmet>
				<title>Sign Up</title>
			</Helmet>
			<h1 className="a-3">Welcome to Fashion-Friendly!!</h1>
			<h6 className="a-3">Please fill in the below fields to continue</h6>
			<Form onSubmit={submitHandler}>
				<Form.Group className="mb-3" controlId="name">
					<Form.Label>Name</Form.Label>
					<Form.Control
						required
						onChange={(e) => setName(e.target.value)}
					/>
					</Form.Group>

				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Number</Form.Label>
					<Form.Control
						required
						onChange={(e) => setNumber(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="confirmpassword">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type="password"
						required
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</Form.Group>
				<div className="mb-3">
					<Button type="submit">Register</Button>
				</div>
				<div className="mb-3">
					Already have an account?{" "}
					<Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
				</div>
			</Form>
		</Container>
	);
}
