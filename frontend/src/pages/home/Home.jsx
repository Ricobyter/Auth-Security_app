import React from 'react'
import './Home.scss'
import LoginImg from '../../assets/login.svg'

export default function Home() {
  return (
    <div>
     
      <section className='container hero'>
        <div className="hero-text">
          <h2>
            Auth-Helper: Your Ultimate Authorization and Login System
          </h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est non cupiditate maiores.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro a sunt perferendis distinctio, sed eos aliquid harum fuga id error!</p>
          <div className="hero-buttons --flex-start">
            <button className="--btn --btn-danger">
              Register
            </button>
            <button className="--btn --btn-primary">
              Login
            </button>

          </div>
        </div>
        <div className="hero-image">
          <img src={LoginImg} alt="Login" />
        </div>

      </section>
  
    </div>
  )
}
