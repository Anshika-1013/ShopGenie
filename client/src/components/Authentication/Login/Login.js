import Account from '../../Account/Account';
import LoginCard from '../../Card/LoginCard/LoginCard';
import UserAccount from '../../Account/MyAccount/UserAccount';
import './Login.css';
import React from 'react';
const Login = () => {
    const [isLoggedIn,setIsLoggedIn]=React.useState(null)

    React.useEffect(() => {
            setIsLoggedIn(window.sessionStorage.getItem("email"))
        }, [])
    //setIsLoggedIn(window.sessionStorage.getItem("email")) 
   
    return ( <>{(isLoggedIn && isLoggedIn!=null)?<UserAccount/>:
        <div className="login__auth__container">
            <div className="login__auth">
                <LoginCard />
            </div>
        </div>
}
        </>
     );
}
 
export default Login;