import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import app from "./firebase.init";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  };
  const handleRegisteredChange = (event) => {
    setRegistered(event.target.checked);
  };
  const handleNameBlur = (event) => {
    setName(event.target.value);
  };
  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }
    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
        password
      )
    ) {
      setError("Password should be strong");
      return;
    }
    setValidated(true);
    setError("");

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          // Signed in
          const user = result.user;
          console.log(user);
          setEmail("");
          setPassword("");
          setUserName();
          setSuccess("You registered successfully");
          verifyEmail();
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    }
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("Email sent");
    });
  };

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log("Updated name");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email verification sent");
    });
  };
  return (
    <div>
      <div className="registration w-50 mx-auto mt-2">
        <h2>Please {registered ? "Login" : "Register"} </h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {!registered && (
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                onBlur={handleNameBlur}
                type="text"
                placeholder="Enter your name "
                required
              />

              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid Email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Password.
            </Form.Control.Feedback>
          </Form.Group>
          <p className="text-success">{success} </p>
          <p className="text-danger">{error} </p>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleRegisteredChange}
              type="checkbox"
              label="Already Registered"
            />
          </Form.Group>
          <button variant="link">Forget Password?</button>
          <br />
          <Button
            onClick={handlePasswordReset}
            variant="primary btn-lg"
            type="submit"
          >
            {registered ? "Login" : "Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
