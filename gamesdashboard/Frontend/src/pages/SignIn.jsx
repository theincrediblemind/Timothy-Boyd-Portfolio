import React, { useState, useRef } from 'react';
import './signin.css';
import blankAvatar from '../images/blank_avatar.png';
import SignUp from './SignUp';

function SignIn({ onSignIn, reference }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [createUser, setCreateUser] = useState(false);
  const [loginError, setLoginError] = useState(false);


  const signUpRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignInClick = () => {
    // Call the prop function to pass email and password
    if (!onSignIn(formData.email, formData.password))
    {
        setLoginError(true);
    }
  };

  const handleSignUpClick = () => {
    setCreateUser(true);
  };

  // Function to handle cancel and switch back to signin page
  const handleCancelClick = () => {
    setCreateUser(false);
  };

  const addUser = (username, email, password, birthDate)=>
  {
    console.log(email, " ", password, " ", username, " ", birthDate);
    const url = `http://localhost:8080/api/createUser?username=${username}&email=${email}&password=${password}&birthDate=${birthDate}`;

    fetch(url)
      .then((res) => {
        console.log(res.status);
        if (!res.ok) {
          if (res.status === 429) {
            // Handle 429 error by waiting and retrying
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        }
      })
      .then((data) => {
        console.log('Response Data:', data)
        return 1;
      })
      .catch((error) => {
        console.error('Fetch Error:', error);
      })
      return -1;
  };

  const handleSignUp = (username, email, password, birthdate) => {
    // Pass the email and password to the confirmUser function
    return addUser(username, email, password, birthdate);
 
  };

  return !createUser ? (
    <section id="signIn" className="signIn" ref={reference}>
        <h1 className="loginTitle"> Welcome to Oros!</h1>
        <h1>Login to Get Started</h1>
        <div className="imgcontainer">
          <img src={blankAvatar} alt="Avatar" className="avatar" />
        </div>
        { loginError? (
            <h2 className='loginError'>User could not be signed in. Email or Password incorrect.</h2>
        ) : <></>};
        <div className="container">
          <label className="formLabel" htmlFor="email"><b>Email</b></label>
          <input type="text" placeholder="Enter email" id="email" name="email" value={formData.email} onChange={handleChange} required />

          <label className="formLabel" htmlFor="password"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" id="password" name="password" value={formData.password} onChange={handleChange} required />

          <button type="button" className="loginBtn" onClick={handleSignInClick}>Login</button>
          <button type="button" className="signUpBtn" onClick={handleSignUpClick}>Create Account</button>
        </div>
    </section>
  ) : (
    <SignUp onSignUp={handleSignUp} reference={signUpRef} onCancel={handleCancelClick} />
  );
}

export default SignIn;
