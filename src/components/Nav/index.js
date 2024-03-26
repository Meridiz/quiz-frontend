import { Container, Nav, NavbarBrand } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';


import './nav.css';

export default function Navbar() {
 
  return (
    <>
      <Container>
        <Nav className="nav">
          <NavLink className="nav-link nav-link-home" to="/">
            Главная страница
          </NavLink>
          <NavLink className="nav-link nav-link-rules" to="/rules">
            Как играть
          </NavLink>
          <NavLink className="nav-link nav-link-leaderboard" to="/leaderboard">
            Доска лидеров
          </NavLink>
          <NavbarBrand className="nav-brand" href="/">Квиз</NavbarBrand>
        </Nav>
      </Container>
    </>
  );
}
