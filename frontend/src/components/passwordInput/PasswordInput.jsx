import React, { useState } from "react";
import "./PassswordInput.scss";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function PasswordInput({placeholder, value, name, onChange, onPaste}) {
   const [showPassword, setShowPassword] =  useState(false)

   const togglePassword = () => {
    setShowPassword(!showPassword)
   }
  return (
    <div className="password">
      <input
        type={showPassword ? "text" : "password"}
        required
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        onPaste = {onPaste}
      />
      <div className="icon" onClick={togglePassword}>
      {showPassword ? (
          <AiOutlineEyeInvisible size={20} />
        ) : (
          <AiOutlineEye size={20} />
        )}
      </div>
    </div>
  );
}
