import {useState} from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {
    
    const [name, setName] = useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                "/auth/register",
                {name, email, password}
            );

            navigate("/");
        } catch (error) {
            alert ("Register Failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>

                <input type="text"
                placeholder="Name"
                onChange={(e) => 
                    setName(e.target.value)
                } />

                <input type="email"
                placeholder="Email"
                onChange={(e) => 
                    setEmail(e.target.value)
                } />

                <input type="password"
                placeholder="Password"
                onChange={(e) => 
                    setPassword(e.target.value)
                } />

                <button type="submit">Register</button>
            </form>
        </div>
    )

}

export default Register;