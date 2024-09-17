import { Link } from 'react-router-dom';
import { useState } from 'react';
import { app, auth, db } from '../../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginCard.css';

const LoginCard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
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

    // Add your password validation criteria here
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.', { autoClose: 5000 });
      return;
    }

    try {
      // Authenticate user
      const response = await signInWithEmailAndPassword(auth, email, password).then(() => {
        window.sessionStorage.setItem("email", email);
        toast.success('Logged in successfully!', { autoClose: 3000 });
        navigate("/");
      });
    } catch (error) {
      console.log(error);
      setError(error.message);
      toast.error(error.message, { autoClose: 3000 });
    }
  };

  return (
    <div className="login__card__container">
      <div className="login__card">
        <div className="login__header">
          <h1>Login</h1>
        </div>
        <div className="login__inputs">
          <div className="email__input__container input__container">
            <label className="email__label input__label">Email</label>
            <input
              type="email"
              className="email__input login__input"
              placeholder='example@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="password__input__container input__container">
            <label className="password__label input__label">Password</label>
            <input
              type="password"
              className="password__input login__input"
              placeholder='********'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login__button__container">
            <button className="login__button" onClick={handleLogin}>
              LOGIN
            </button>
          </div>
          {error && <div className="login__error">{error}</div>}
        </div>
        <div className="login__other__actions">
          <div className="login__forgot__password">Forgot password?</div>
          <div className="login__new__account">
            Don't have an account? <Link to="/account/register">Create account</Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginCard;



















// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { app, auth, db } from '../../../firebase';
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify'; // Import react-toastify
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
// import './LoginCard.css';

// const LoginCard = (app) => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);

//   const handleLogin = async () => {
//     // Input field validations
//     if (!email.trim()) {
//       toast.error('Please enter your email.', { autoClose: 3000 });
//       return;
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       toast.error('Please enter a valid email address.', { autoClose: 3000 });
//       return;
//     }

//     if (!password.trim()) {
//       toast.error('Please enter your password.', { autoClose: 3000 });
//       return;
//     }

//     try {
//       // Authenticate user
//       const response = await signInWithEmailAndPassword(auth, email, password).then(() => {
//         window.sessionStorage.setItem("email", email);
//         toast.success('Logged in successfully!', { autoClose: 3000 }); // Show success toast
//         navigate("/");
//       });
//     } catch (error) {
//       console.log(error);
//       setError(error.message);
//       toast.error(error.message, { autoClose: 3000 }); // Show error toast
//     }
//   };

//   return (
//     <div className="login__card__container">
//       <div className="login__card">
//         <div className="login__header">
//           <h1>Login</h1>
//         </div>
//         <div className="login__inputs">
//           <div className="email__input__container input__container">
//             <label className="email__label input__label">Email</label>
//             <input
//               type="email"
//               className="email__input login__input"
//               placeholder='example@gmail.com'
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="password__input__container input__container">
//             <label className="password__label input__label">Password</label>
//             <input
//               type="password"
//               className="password__input login__input"
//               placeholder='********'
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <div className="login__button__container">
//             <button className="login__button" onClick={handleLogin}>
//               LOGIN
//             </button>
//           </div>
//           {error && <div className="login__error">{error}</div>}
//         </div>
//         <div className="login__other__actions">
//           <div className="login__forgot__password">Forgot password?</div>
//           <div className="login__new__account">
//             Don't have an account? <Link to="/account/register">Create account</Link>
//           </div>
//         </div>
//       </div>
//       <ToastContainer /> {/* Add ToastContainer for displaying toast notifications */}
//     </div>
//   );
// };

// export default LoginCard;

















// import { Link } from 'react-router-dom';
// import { useState } from 'react'; // Import useState hook if you haven't already
// import { app, auth, db } from '../../../firebase';
// import {signInWithEmailAndPassword} from "firebase/auth";
// import { useNavigate } from 'react-router-dom';
// //import {doc,collection,set} from "firebase/firestore"; 
// import './LoginCard.css';

// const LoginCard = (app) => {
//     const naviagteTo=useNavigate()
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);
//     console.log(auth)
//     const handleLogin = async () => {
//         try {
//             // Authenticate user
//             const response = await signInWithEmailAndPassword(auth,email, password).then(() => {
//                 window.sessionStorage.setItem("email",email)
//                 naviagteTo( "/" )});
            
//             // If authentication successful, write user data to Firestore
//             // await db.collection('users').doc(email).set({
//             //     email: email,
//             //     password: password
//             // });
    
//             // Clear form fields and error state
//             setEmail('');
//             setPassword('');
//             setError(null);
    
//             // Redirect or perform any other action upon successful login
//         } catch (error) {
//             console.log(error);
//             setError(error.message);
//         }
//     };
    
//     return ( 
//         <div className="login__card__container">
//             <div className="login__card">
//                 <div className="login__header">
//                     <h1>Login</h1>
//                 </div>
//                 <div className="login__inputs">
//                     <div className="email__input__container input__container">
//                         <label className="email__label input__label">Email</label>
//                         <input type="email" className="email__input login__input" placeholder='example@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} />
//                     </div>
//                     <div className="password__input__container input__container">
//                         <label className="password__label input__label" >Password</label>
//                         <input type="password" className="password__input login__input" placeholder='**********' value={password} onChange={(e) => setPassword(e.target.value)} />
//                     </div>
//                     <div className="login__button__container">
//                         <button className="login__button" onClick={handleLogin}>LOGIN</button>
//                     </div>
//                     {error && <div className="login__error">{error}</div>}
//                 </div>
//                 <div className="login__other__actions">
//                     <div className="login__forgot__password">Forgot password?</div>
//                     <div className="login__new__account">Don't have an account? <Link to="/account/register">Create account</Link> </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
 
// export default LoginCard;
