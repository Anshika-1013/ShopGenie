import { Link } from 'react-router-dom';
import { useState } from 'react';
import { auth, db } from '../../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import './RegisterCard.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterCard = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // First name validation
    if (!firstName.trim()) {
      toast.error('Please enter your first name.', { autoClose: 3000 });
      return;
    }

    if (/^\d+$/.test(firstName)) {
      toast.error('First name should not contain only numbers.', { autoClose: 3000 });
      return;
    }

    // Last name validation
    if (!lastName.trim()) {
      toast.error('Please enter your last name.', { autoClose: 3000 });
      return;
    }

    if (/^\d+$/.test(lastName)) {
      toast.error('Last name should not contain only numbers.', { autoClose: 3000 });
      return;
    }

    // Email validations
    if (!email.trim()) {
      toast.error('Please enter your email.', { autoClose: 3000 });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', { autoClose: 3000 });
      return;
    }

    // Password validations
    if (!password.trim()) {
      toast.error('Please enter your password.', { autoClose: 3000 });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.', { autoClose: 5000 });
      return;
    }

    try {
      // Create user with email and password
      const response = await createUserWithEmailAndPassword(auth, email, password);

      // If user creation successful, write user data to Firestore
      await setDoc(doc(db, 'users', `${email}`), {
        firstName: firstName,
        lastName: lastName,
        email: email
      });

      navigate("/");

      // Clear form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      toast.success('Registration successful!', { autoClose: 3000 });
    } catch (error) {
      console.log(error);
      toast.error(error.message, { autoClose: 3000 });
    }
  };

  return (
    <div className="register__card__container">
      <div className="register__card">
        <div className="register__header">
          <h1>Create Account</h1>
        </div>
        <div className="register__inputs">
          <div className="fname__input__container reg__input__container">
            <label className="fname__label input__label">First name</label>
            <input
              type="text"
              className="fname__input register__input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="lname__input__container reg__input__container">
            <label className="lname__label input__label">Last name</label>
            <input
              type="text"
              className="lname__input register__input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="email__input__container reg__input__container">
            <label className="email__label input__label">Email</label>
            <input
              type="email"
              className="email__input register__input"
              placeholder='example@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="password__input__container reg__input__container">
            <label className="password__label input__label">Password</label>
            <input
              type="password"
              className="password__input register__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="register__button__container">
            <button className="register__button" onClick={handleRegister}>
              Create Account
            </button>
          </div>
        </div>
        <div className="register__other__actions">
          <div className="register__login__account">
            Already have an account? <Link to="/account/login">Login</Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterCard;




















// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { auth, db } from '../../../firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from "firebase/firestore";
// import './RegisterCard.css';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const RegisterCard = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleRegister = async () => {
//     // First name validation
//     if (!firstName.trim()) {
//       toast.error('Please enter your first name.', { autoClose: 3000 });
//       return;
//     }

//     // Last name validation
//     if (!lastName.trim()) {
//       toast.error('Please enter your last name.', { autoClose: 3000 });
//       return;
//     }

//     // Email validations
//     if (!email.trim()) {
//       toast.error('Please enter your email.', { autoClose: 3000 });
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       toast.error('Please enter a valid email address.', { autoClose: 3000 });
//       return;
//     }

//     // Password validations
//     if (!password.trim()) {
//       toast.error('Please enter your password.', { autoClose: 3000 });
//       return;
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.', { autoClose: 5000 });
//       return;
//     }

//     try {
//       // Create user with email and password
//       const response = await createUserWithEmailAndPassword(auth, email, password);

//       // If user creation successful, write user data to Firestore
//       await setDoc(doc(db, 'users', `${email}`), {
//         firstName: firstName,
//         lastName: lastName,
//         email: email
//       });

//       navigate("/");

//       // Clear form fields and error state
//       setFirstName('');
//       setLastName('');
//       setEmail('');
//       setPassword('');
//       setError(null);
//       toast.success('Registration successful!', { autoClose: 3000 });
//     } catch (error) {
//       console.log(error);
//       setError(error.message);
//       toast.error(error.message, { autoClose: 3000 });
//     }
//   };

//   return (
//     <div className="register__card__container">
//       <div className="register__card">
//         <div className="register__header">
//           <h1>Create Account</h1>
//         </div>
//         <div className="register__inputs">
//           <div className="fname__input__container reg__input__container">
//             <label className="fname__label input__label">First name</label>
//             <input
//               type="text"
//               className="fname__input register__input"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//             />
//           </div>
//           <div className="lname__input__container reg__input__container">
//             <label className="lname__label input__label">Last name</label>
//             <input
//               type="text"
//               className="lname__input register__input"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//             />
//           </div>
//           <div className="email__input__container reg__input__container">
//             <label className="email__label input__label">Email</label>
//             <input
//               type="email"
//               className="email__input register__input"
//               placeholder='example@gmail.com'
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="password__input__container reg__input__container">
//             <label className="password__label input__label">Password</label>
//             <input
//               type="password"
//               className="password__input register__input"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <div className="register__button__container">
//             <button className="register__button" onClick={handleRegister}>
//               Create Account
//             </button>
//           </div>
//           {error && <div className="register__error">{error}</div>}
//         </div>
//         <div className="register__other__actions">
//           <div className="register__login__account">
//             Already have an account? <Link to="/account/login">Login</Link>
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default RegisterCard;



// import { Link } from 'react-router-dom';
// import { useState } from 'react'; // Import useState hook
// import { auth, db } from '../../../firebase'; // Import Firebase authentication and Firestore
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import {doc,setDoc}from "firebase/firestore";
// import './RegisterCard.css';
// import { useNavigate } from 'react-router-dom';
// const RegisterCard = () => {
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);
//     const naviagteTo=useNavigate()
//     const handleRegister = async () => {
        
//         try {
//             // Create user with email and password
//             const response = await createUserWithEmailAndPassword(auth,email, password);

//             // If user creation successful, write user data to Firestore
//             await setDoc(doc(db,'users',`${email}`),{
//                 firstName: firstName,
//                 lastName: lastName,
//                 email: email
//                 // Add more fields as needed
//             })
//             naviagteTo( "/" );
//             // Clear form fields and error state
//             setFirstName('');
//             setLastName('');
//             setEmail('');
//             setPassword('');
//             setError(null);

//             // Redirect or perform any other action upon successful registration
//         } catch (error) {
//             //setError(error.message);
//             console.log(error);
//         }
//     };

//     return ( 
//         <div className="register__card__container">
//             <div className="register__card">
//                 <div className="register__header">
//                     <h1>Create Account</h1>
//                 </div>
//                 <div className="register__inputs">
//                     <div className="fname__input__container reg__input__container">
//                         <label className="fname__label input__label">First name</label>
//                         <input type="text" className="fname__input register__input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//                     </div>
//                     <div className="lname__input__container reg__input__container">
//                         <label className="lname__label input__label">Last name</label>
//                         <input type="text" className="lname__input register__input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
//                     </div>
//                     <div className="email__input__container reg__input__container">
//                         <label className="email__label input__label">Email</label>
//                         <input type="email" className="email__input register__input" placeholder='example@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} />
//                     </div>
//                     <div className="password__input__container reg__input__container">
//                         <label className="password__label input__label">Password</label>
//                         <input type="password" className="password__input register__input" value={password} onChange={(e) => setPassword(e.target.value)} />
//                     </div>
//                     <div className="register__button__container">
//                         <button className="register__button" onClick={handleRegister}>Create Account</button>
//                     </div>
//                     {error && <div className="register__error">{error}</div>}
//                 </div>
//                 <div className="register__other__actions">
//                     <div className="register__login__account">Already have an account? <Link to="/account/login">Login</Link></div>
//                 </div>
//             </div>
//         </div>
//      );
// }
 
// export default RegisterCard;





//authInstance._getRecaptchaConfig is not a function
