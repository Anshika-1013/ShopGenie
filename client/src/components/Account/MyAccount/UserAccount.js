import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {useNavigate} from "react-router-dom"
//import './UserAccount.css'; // Import UserAccount component styles

export default function UserAccount() {
    const [user, setUser] = useState({});
    const naviagteTo = useNavigate()
    const getUser = async () => {
        if (auth.currentUser.email) {
            await getDoc(doc(db, "users", `${auth.currentUser.email}`)).then((docSnapshot) => {
                setUser(docSnapshot.data());
            });
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.sessionStorage.removeItem("email");
            naviagteTo( "/")
            // Redirect or perform any other action after logout
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    }

    return (
        <div className="user__card__container">
            <div className="user__card">
                <div className="user__header">
                    <h1>User Account</h1>
                </div>
                <div className="user__details">
                    <p><strong>Name:</strong> {user.firstName ? user.firstName : "John"} {user.lastName ? user.lastName : "Doe"}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
                <div className="user__actions">
                    <button className="logout__button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}
