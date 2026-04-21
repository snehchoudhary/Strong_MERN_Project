import {useState, useContext} from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import {AuthContext} from "../context/AuthContext";

function Login() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {login} = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            login(res.data.token);

            navigate("/dashboard");
        } catch (error) {
            alert ("Login Failed");
        }
    };

    return (

        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input type="email"
                placeholder="Email"
                onChange={(e) => 
                    setEmail(e.target.value)
                } />

                <input type="password"
                placeholder="Password"
                onChange={(e) => 
                    setPassword(e.target.value)
                }  />

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;