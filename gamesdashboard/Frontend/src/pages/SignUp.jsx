import React, {useState} from 'react'
import './signup.css'


function SignUp({onSignUp, onCancel, reference}) {

    const [formData, setFormData] = useState({ email: '', password: '', uname: '', birthdate: '' });
    const [signedUp, setSignedUp] = useState(false);
    const [signUpError, setsignUpError] = useState(false);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSignUpClick = () => {


        // Call the prop function to pass email and password
       if (onSignUp(formData.uname, formData.email, formData.password, formData.birthdate) === 1)
       {
        setSignedUp(true);
        setsignUpError(false);
       }
       else
       {
            setsignUpError(true);
       }
      };
      
      return !signedUp ? (
        <section id="signIn" className="signIn" ref={reference}>
            { signUpError ?
            (
                <h2 className="signUpError">Looks like this user already exists! Try logging in</h2>
            ) : <></>}
          <div className="container">
            <label className="formLabel" htmlFor="uname"><b>Username</b></label>
            <input type="text" placeholder="Enter username" id="uname" name="uname" value={formData.uname} onChange={handleChange} required />
            
            <label className="formLabel" htmlFor="birthdate"><b>Date of Birth</b></label>
            <input type="date" placeholder="Enter Date of Birth" id="birthdate" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
            
            <label className="formLabel" htmlFor="email"><b>Email</b></label>
            <input type="text" placeholder="Enter email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            
            <label className="formLabel" htmlFor="password"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            
            <button type="button" className="signUpBtn" onClick={handleSignUpClick}>Confirm</button>
            <button type="button" className="cancelBtn" onClick={onCancel}>Cancel</button>
            
          </div>
        </section>
      ) : onCancel();

}

export default SignUp