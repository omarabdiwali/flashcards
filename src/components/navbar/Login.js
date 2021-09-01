import React, { useEffect, useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router-dom';

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetch('/me').then(res => res.json())
      .then(data => {
        if (data.response === "Logged In!") {
          setLoggedIn(true);
        }
        else {
          setLoggedIn(false);
        }
    })
    .catch(err => console.error(err));
  }, [])

  function logIn(resp) {
    setLoggedIn(true);
    fetch("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({
        token: resp.tokenId
      }),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json())
      .then(data => console.log(data.response))
      .catch(err => console.error(err));
    
    setTimeout(() => {
      history.push('/');
      window.location.reload();
    }, 1500);
  }

  function logOut() {
    fetch('/logout')
      .then(res => res.json())
      .then(data => console.log(data.response))
      .catch(err => console.error(err));
    
    setLoggedIn(false);

    history.push('/');
    window.location.reload();
  }

  return (
    <>
      {!loggedIn ? (
        <GoogleLogin
          clientId={process.env.REACT_APP_CLIENT_ID}
          buttonText="Login"
          onSuccess={logIn}
          onFailure={() => {alert('Not logged in.')}}
          cookiePolicy={'single_host_origin'}
      />
      ) : (
        <GoogleLogout
        clientId={process.env.REACT_APP_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={logOut}
        />
      )}
    </>
  )
}