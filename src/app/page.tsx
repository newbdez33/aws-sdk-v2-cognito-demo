"use client";
import styles from "./page.module.css";
import AWS from "aws-sdk";

import { useEffect, useState } from "react";
import { SignUpRequest } from "aws-sdk/clients/cognitoidentityserviceprovider";

const identityPoolId = "ap-northeast-1:e34b2650-6534-4a9d-9175-7c48ab09921e";
const region = "ap-northeast-1";
const userPoolId = "ap-northeast-1_5m8RVZmc2";
AWS.config.update({
  region: region,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId
  })
})

const changePassword = () => {
  const payload = {
    AccessToken: "accessToken",
    PreviousPassword: "Aa@1234567",
    ProposedPassword: "Aa@12345678"
  };
  var cognito = new AWS.CognitoIdentityServiceProvider();
  cognito.changePassword(payload, function(err,data) {
      if (err) {
          alert("Error: " + err);
      }
      else {
          alert("Success!");
      }
  });
}

export default function Home() {
  const [clientId, setClientId] = useState("49vc82dntr273p3hs4aru131a7");
  const [username, setUsername] = useState("test3");
  const [password, setPassword] = useState("Aa@1234567");
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [output, setOutput] = useState("");
  const [selectedFile, setSelectFile] = useState(null as any);
  const login = () => {
    setOutput("");
    const payload = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters : {
          USERNAME: username,
          PASSWORD: password
      }
    }
    var cognito = new AWS.CognitoIdentityServiceProvider();
    cognito.initiateAuth(payload, function(err,data) {
        if (err) {
          alert("Error: " + err);
        } else {

          // this is for S3 uploading.
          AWS.config.update({
            region: region,
            credentials: new AWS.CognitoIdentityCredentials({
              IdentityPoolId: identityPoolId,
              Logins: {
                [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: data.AuthenticationResult?.IdToken ?? ""
              }
            })
          });

          console.log(data);
          setOutput(JSON.stringify(data));
        }
    })
  }
  const signUp = () => {
    setOutput("");
    const signupRequest:SignUpRequest = {
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "nickname",
          Value: `DisplayName-${username}`
        },
        {
          Name: "email",
          Value: email
        },
        {
          Name: "picture",
          Value: "https://example.com/picture.jpg"
        },
        {
          Name: "locale",
          Value: "JP"
        }
      ]
    }
    var cognito = new AWS.CognitoIdentityServiceProvider();
    cognito.signUp(signupRequest, function(err,data) {
        if (err) {
            alert("Error: " + err);
        }
        else {
            setOutput(JSON.stringify(data));
        }
    })
  }
  const confirmSignUp = () => {
    setOutput("");
    const payload = {
      ClientId: clientId,
      ConfirmationCode: confirmationCode,
      Username: username
    }
    var cognito = new AWS.CognitoIdentityServiceProvider();
    cognito.confirmSignUp(payload, function(err,data) {
        if (err) {
            alert("Error: " + err);
        }
        else {
            setOutput("Success:" + JSON.stringify(data));
        }
    });
  }
  const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    setSelectFile(file);
  }
  const handleFileUpload = async () => {
    console.log(AWS.config.credentials);
    if (!selectedFile) {
      return;
    }
    const s3 = new AWS.S3();
    const params = {
      Bucket: "public-test-0422",
      Key: selectedFile.name,
      Body: selectedFile
    };
    s3.upload(params, function(err: any, data: any) {
      if (err) {
        alert("Error: " + err);
      } else {
        setOutput(JSON.stringify(data));
      }
    });
  }
  useEffect(() => {
    //login();
    //signUp();
  })
  return (
    <main className={styles.main}>
      <div className={styles.f}>
        <div className={styles.row}><label htmlFor="clientId">ClientId</label><input type="text" placeholder="ClientId" id="clientId" value={clientId} onChange={(e) => { setClientId(e.target.value)}}/></div>
        <div className={styles.row}><label >User name</label><input type="text" placeholder="Username"  value={username} onChange={(e) => { setUsername(e.target.value)}}/></div>
        <div className={styles.row}><label >Email</label><input type="text" placeholder="Email"  value={email} onChange={(e) => { setEmail(e.target.value)}}/></div>
        <div className={styles.row}><label >Password</label><input type="text" placeholder="Password"  value={password} onChange={(e) => { setPassword(e.target.value)}}/></div>
        <div className={styles.row}><label >Confirmation code</label><input type="text" placeholder="ConfirmationCode"  value={confirmationCode} onChange={(e) => { setConfirmationCode(e.target.value)}}/></div>
        <div className={styles.row}><label >Refresh token</label><input type="text" placeholder="RefreshToken"  value={refreshToken} onChange={(e) => { setRefreshToken(e.target.value)}}/></div>
        <div className={styles.row}>
          <button onClick={login}>Login</button>
          <button onClick={signUp}>Sign Up</button>
          <button onClick={confirmSignUp}>Confirm Signup</button>
          <button onClick={handleFileUpload}>Upload</button>
        </div>
        <div className={styles.row}>
          <input type="file" onChange={(e) => { handleFileChange(e)}} />
        </div>
      </div>
      <div>
        <textarea rows={8} cols={80} value={output} readOnly></textarea>
      </div>
    </main>
  );
}
