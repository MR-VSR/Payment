import React, { useState } from 'react'
import base64 from 'react-native-base64'
import axios from "axios";

export default function Form() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: ""
  });
  
  const handleClick = async (e) => {
    const res = await axios.post("http://localhost:4000/open", user)
    window.open(res.data);
  }

  return (
    <>
      <label>
        Name:
        <input type="text" name="name" value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })} />
      </label>
      <label>
        Email:
        <input type="text" name="name" value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })} />
      </label>
      <label>
        Mobile:
        <input type="text" name="name" value={user.mobile}
          onChange={(e) => setUser({ ...user, mobile: e.target.value })} />
      </label>
      <button onClick={e => handleClick(e)}>Pay</button>
    </>
  )
}
