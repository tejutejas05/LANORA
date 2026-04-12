import { useState } from "react";

function Register(){
    const [form, setForm]=useState({
        email:"",
        password:"",
        confirmPassword:""
    });

    const [error, setError]=useState("");
    const [success, setSuccess]=useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // const handleSubmit =async (e)=>{      after connecting backend i need to uncomment this and  delete that mock waala
    //     e.preventDefault();

    //     if(form.password != form.confirmpasssword){
    //         setError("incorrect Password")
    //         return;
    //     }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            setSuccess("");
            return;
        }


            setError("");
            setSuccess("Creating Account...");

            setTimeout(() => {
                console.log("Form submitted:", form); 
                setSuccess("Account created successfully!");
            }, 1000);
        }

    //     try {
    //         const res =await fetch("https://localhost:8080/register",{
    //             method:"post",
    //             headers:{
    //                 "content-Type" : "application/json"
    //             },
    //             body: JSON.stringify({
    //                 email: form.email,
    //                 password: form.password
    //             })
    //         });

    //         const data=await res.json();

    //         if (! res.ok){
    //             setError(data.message || "Registration failed");
    //             return;
    //         }
    //         setSuccess("Account created Successfully!");
    //         setError("");
    //     }catch(err){
    //         setError("something went Wrong");
    //     }
    // };

    return(
        <div className="min-h-screen flex items-center justify-center bg-black text-white">

            <form 
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl w-[350px] space-y-5 shadow-xl border border-gray-700"
            >
                <div className="text-center space-y-1">
                <h1 className="text-xl tracking-widest text-gray-300">LANORA</h1>
                <p className="text-sm text-gray-400">Create your Account</p>
                <p className="text-xs text-gray-500">Just Fill this Details and Get Started!</p>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Your Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 rounded-lg bg-transparent border border-gray-600 outline-none focus:border-gray-400"
                        />
                </div>


                <div>
                    <label className="text-sm text-gray-400">Password</label>
                        <div className="flex items-center border border-gray-600 rounded-lg mt-1 px-3">
                            <input
                            type="password"
                            name="password"
                            placeholder="Enter new Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent outline-none"
                            />
                            
                        </div>
                </div>



                <div>
                <label className="text-sm text-gray-400">Confirm Password</label>

                <div className="flex items-center border border-gray-600 rounded-lg mt-1 px-3">
                    <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-Enter the Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 bg-transparent outline-none"
                    />
                    
                </div>
                </div>


                {error && <P className="text-red-400 text-sm">{error}</P>}
                {success && <p className="text-green-400 text-sm">{success}</p>}

                <button
                    type="submit"
                    className="w-full bg-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                    Continue
                </button>

            </form>
        </div>
    );
}

export default Register;