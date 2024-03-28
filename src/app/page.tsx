"use client";
import Image from "next/image";
import styles from "./page.module.css";
import AWS from "aws-sdk";

import { useEffect } from "react";
import { SignUpRequest } from "aws-sdk/clients/cognitoidentityserviceprovider";

AWS.config.update({
  region: "ap-northeast-1",
})

const login = () => {
  const payload = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "s3dkibg9s5ji8nhqpl9oboiha",
    AuthParameters : {
        USERNAME: "newbdez33+cognitotest@gmail.com",
        PASSWORD: "Aa@1234567"
    }
  }
  var cognito = new AWS.CognitoIdentityServiceProvider();
  cognito.initiateAuth(payload, function(err,data) {
      if (err) {
        alert("Error: " + err);
      }
      else {
        console.log(data);
        alert("Success!");
      }
  })
}

const signUp = () => {
  const signupRequest:SignUpRequest = {
    ClientId: "s3dkibg9s5ji8nhqpl9oboiha",
    Username: "newbdez33+cognitotest@gmail.com",
    Password: "Aa@1234567",
    UserAttributes: [
      {
        Name: "gender",
        Value: "Male"
      },
      {
        Name: "nickname",
        Value: "nick name"
      }
    ]
  }
  var cognito = new AWS.CognitoIdentityServiceProvider();
  cognito.signUp(signupRequest, function(err,data) {
      if (err) {
          alert("Error: " + err);
      }
      else {
          alert("Success!");
      }
  })
};

export default function Home() {
  useEffect(() => {
    //login();
    //signUp();
  })
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <button onClick={login}>Login</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
    </main>
  );
}
