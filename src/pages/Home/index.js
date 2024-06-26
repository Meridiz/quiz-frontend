import QuizLogo from "../../assets/quiz-logo.png";
import { userActions } from '../../reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Button, Container, Form } from "react-bootstrap";
import { NewGameButtons } from '../../components';

import "./Home.css";

export default function Home() {
  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.username);

  const [input, setInput] = useState('');

  function updateInput(e) {
    setInput(e.target.value);
  }

  function submitUsername(e) {
    e.preventDefault();
    dispatch(userActions.setUsername(input));
    localStorage.setItem('username', input);
    setInput('');
  }
    
    return (
        <>
            <article className="home-container">
                <Container className="home-inner-container">
                
                    <Container className="welcome-div">
                        <h2 className="home-h2a">Начните игру! </h2>
                        <h2 className="home-h2b">Время для</h2>
                        <h1 className="home-h1">Квиза!</h1>
                        <Container className="quiz-logo-container">
                            <img className="quiz-logo" src={QuizLogo} alt="quiz logo"></img>
                        </Container>
                    </Container>
                    
                    <Container className="username-form-container">
                    {!username && (
            <Form
              onSubmit={submitUsername}
              className="d-flex justify-content-center username-form"
            >
              <label className="username-form-header" htmlFor="user-input">Введите свое имя </label>
              <br />
              <input
                type="text"
                id="user-input"
                onChange={updateInput}
                value={input}
                placeholder="имя"
              />
              <Button id="start-btn" type="submit">Старт</Button>
            </Form>
          )}
          {username && <NewGameButtons />}
          </Container>
        </Container>
                
            </article>
        </>
    )

}
