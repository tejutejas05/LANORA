import { useState } from "react";

function Register(){
    const [form, setForm]=useState({
        email:"",
        password:"",
        confirmpasssword:""
    });

    const [error, setError]=useState("");
    const [success, setSuccess]=usestate("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit =async (e)=>{
        e.preventDefault();

        if(form.password != form.confirmpasssword){
            setError("incorrect Password")
            return;
        }

        try {
            const res =await fetch("https://localhost:8080/register",{
                method:"post",
                headers:{
                    "content-Type" : "application/json"
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            });

            const data=await res.json();

            if (! res.ok){
                setError(data.message || "Registration failed");
                return;
            }
            setSuccess("Account created Successfully!");
            setError("");
        }catch(err){
            setError("something went Wrong");
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-black text-white">

            <form 
            onSubmit={handleSubmit}
            className="bg-gray-900 p-8 rounded-x w-80 space-y-4"
            >
                <h2 className="text-xl font-bold text-center"> Register</h2>

                <input 
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-800 outline-none"
                    required
                />

                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-800 outline-none"
                    required 
                    />
                <input 
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-800 outline-none"
                    required
                />

                {error && <P className="text-red-400 text-sm">{error}</P>}
                {success && <p className="text-green-400 text-sm">{success}</p>}

                <button 
                    type="submit"
                    className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;