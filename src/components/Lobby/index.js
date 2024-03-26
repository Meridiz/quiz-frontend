import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { matchActions } from '../../reducers';
import axios from 'axios';

import "./Lobby.css";

export default function Lobby({roomHost, roomNum, isHost, socket, players}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hostName = useSelector((state) => state.match.playersInGame[0]);


  /* --- Socket emits --- */
  //host start game
  function hostStartGame(questions){
    socket.emit('assign_tokenId', {players: players, room: roomNum})
    socket.emit('host_start_game', {roomNum, questions});
  }

  const categories = [
    { code: 9, name: 'Базовые знания' },
    { code: 10, name: 'Книги' },
    { code: 11, name: 'Фильмы' },
    { code: 12, name: 'Музыка' },
    { code: 17, name: 'Наука и природа' },
    { code: 20, name: 'Мифология' },
    { code: 23, name: 'История' },
    { code: 25, name: 'Искусство' },
  ];

  const backToMainButton = () => {
    navigate('/');
  };

  const getData = async (target) => {
    try {
      const result = await axios.get(
        `https://opentdb.com/api.php?amount=${target.questionsNumber.value}&category=${target.category.value}&difficulty=${target.difficulty.value}&type=multiple`
      );
      const data = await result.data;
      return data;
    } catch (error) {
      console.warn(error.message);
    }
  };

  const translate = async (text) => {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    let data = {
      text,
    };
    const response = await axios.post('/.netlify/functions/translate', data=data)
    return response.data.text;
  }

  const startGame = async (e) => {
    e.preventDefault();
    let apiQuestions = await getData(e.target);

    let restructuredQuestions = [];

    const shuffleArray = (array) => {
      let currentIndex = array.length,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      return array;
    }

    await Promise.all(apiQuestions.results.map(async (item) => {
      return restructuredQuestions.push({
        question: await translate(item.question),
        answers: shuffleArray([
          { isCorrect: true, answer: await translate(item.correct_answer) },
          { isCorrect: false, answer: await translate(item.incorrect_answers[0]) },
          { isCorrect: false, answer: await translate(item.incorrect_answers[1]) },
          { isCorrect: false, answer: await translate(item.incorrect_answers[2]) },
        ]),
      });
    }));

    dispatch(matchActions.updateQuestionsArray(restructuredQuestions));
    dispatch(matchActions.updateGameStart());
    hostStartGame(restructuredQuestions);
  };

  return (
    <>
    <Container className="lobby-container shadow">
      <Button className="back-btn shadow" onClick={backToMainButton}>Главная</Button>
      <h1 className="lobby-hoster">Хост игры: {hostName}</h1>
      <h2 className="lobby-room">{`Номер комнаты: ${roomNum}`}</h2>

      {
        isHost ?
        <Form className="lobby-form" onSubmit={startGame}>
        <Form.Group className="mb-3">
          <Form.Label className="form-label" htmlFor="category">Категория</Form.Label>
          <Form.Select className="form-select shadow" id="category" name="category">
            {categories.map((category, index) => (
              <option key={index} value={category.code}>
                {category.name}
              </option>
            ))}
          </Form.Select>
          <Form.Label className="form-label" htmlFor="difficulty">Сложность</Form.Label>
          <Form.Select className="form-select shadow" id="difficulty" name="difficulty">
            <option value="easy">Легкий</option>
            <option value="medium">Средний</option>
            <option value="hard">Сложный</option>
          </Form.Select>
          <Form.Label className="form-label" htmlFor="questionsNumber">Номер вопроса</Form.Label>
          <Form.Select className="form-select shadow" name="questionsNumber" id="questionsNumber">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </Form.Select>
        </Form.Group>

        <Button className="start-btn shadow" type="submit">Начать игру</Button>
      </Form>
        : null
      }
        
      </Container>
    </>
  );
}
