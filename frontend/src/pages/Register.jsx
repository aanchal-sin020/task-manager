import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Account created. Please login.");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Sign Up</h2>
       
       <input
         type="text"
         placeholder="Name"
         value={name}
         onChange={(e) => setName(e.target.value)}
         style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <button
        onClick={handleRegister}
        style={{ width: "100%", padding: "8px" }}
      >
        Sign Up
      </button>
    </div>
  );
}

export default Register;
