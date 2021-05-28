import React, { useState } from 'react'
import styled from 'styled-components'
import { Container } from '../GlobalStyles';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store';
// import { ProgressPlugin } from 'webpack';
import { updateSessionAction } from '../store/homeStatus';
//import mapLogo from '../../public/mapLogo.png'  -> module not found 


const Navbar = ({ handleClick, isLoggedIn, photo, firstName, updateSessionAction }) => {

  const [open, setOpen] = useState(false)

  return (
    <Nav>
      <NavbarContainer>
        {/* <h1 style={{ textShadow: '4px 3px 0px #fff, 9px 8px 0px rgba(0,0,0,0.15)' }}>Meedle</h1> */}
        <Link to="/home" onClick={() => updateSessionAction(null)}>
          <h1 className="logo">
            Meedle
        </h1>
        </Link>
        
        {
          isLoggedIn &&
          <div>{
            photo ?
              <ProfilePhoto src={`${photo}`} /> :
              <Name>{firstName.slice(0, 1)}</Name>
          }</div>
        }

        <div className="flexNav">
          {isLoggedIn ? (
            <NavMenu open={open}>
              {/* The navbar will show these links after you log in */}
              <NavLink to="/home" onClick={() => updateSessionAction(null)}>Home</NavLink>
              <NavLink to="/home" onClick={handleClick}>
                Logout
          </NavLink>
            </NavMenu>
          ) : (
            <NavMenu open={open}>
              {/* The navbar will show these links before you log in */}
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </NavMenu>
          )}

          <StyledBurger open={open} onClick={() => setOpen(!open)}>
            <div />
            <div />
            <div />
          </StyledBurger>
        </div>
      </NavbarContainer>
    </Nav>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.auth.id,
    photo: state.auth.photo,
    firstName: state.auth.firstName
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    updateSessionAction: (action) => dispatch(updateSessionAction(action)),
  }
}

const Nav = styled.nav` 
  margin: 0px;
  position: sticky;
  top: 0;
  height: 80px;
  background-color: #a5ecd7;
  z-index: 3;
  // box-shadow: 0px 5px 20px rgb(48,181,204, 0.5); 
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width:600px){
    overflow: hidden;
    position: relative;
  }
`;

const NavbarContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width:600px){
    display: flex;
    justify-content: space-between;
  }
  ${Container};
`;

const NavLink = styled(Link)`
  text-decoration: none;
  margin: 10px;
  font-weight: bold;
  font-size: 18px;
  color: #0f3057;
  transition: all .2s ease;
  &:hover {
    color: #1F817F;
  }
  &:active {
      transform: traslateY(3rem);
      color: #32e0c4;
  }
  @media screen and (max-width:600px){
    text-decoration: none;
    font-size: 17px;
    width: 100%;

    // &:hover { 
    //   background-color: #fff;
    // }
  }

`;


const NavMenu = styled.div`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  
  @media (max-width: 600px) {
    flex-flow: column nowrap;
    background-color: #e4efe7;
    position: fixed;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
    top: 0;
    right: 0;
    height: 100vh;
    width: 180px;
    padding-top: 2px;
    transition: transform 0.3s ease-in-out;
    li {
      color: #0f3057;
    }
  }
`;

const StyledBurger = styled.div`
  width: 4rem;
  height: 4rem;
  top: 10px;
  right: 20px;
  z-index: 20;
  display: none;
  @media (max-width: 600px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }
  div {
    margin-top: 0.5rem;
    width: 4rem;
    height: 1rem;
    background-color: ${({ open }) => open ? '#ccc' : '#0f3057'};
    border-radius: 10px;
    transform-origin: 1px;
    transition: all 0.3s linear;
    &:nth-child(1) {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }
    &:nth-child(2) {
      transform: ${({ open }) => open ? 'translateX(100%)' : 'translateX(0)'};
      opacity: ${({ open }) => open ? 0 : 1};
    }
    &:nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const ProfilePhoto = styled.img`
  border: solid 1px #0f3057;
  border-radius: 50%;
  height: 50px;
  width: 50px;
<<<<<<< HEAD
  // margin-left: 10px;
  @media screen and (max-width:600px){
    height: 45px;
    width: 45px;
=======
  margin-left: 20px;
  margin-right: 20px;
  @media screen and (max-width:600px){
    height: 50px;
    width: 50px;
    
>>>>>>> f28e11696d68c125e247d3b6516e9729aa21436e
    // display: none;
  }
`

const Name = styled.h1`
  border: solid 1px white;
  text-align:center;
  padding-top: 35%;
  border-radius: 50%;
  height: 60px;
  width: 60px;
  background-color: #faf1e6;
`

export default connect(mapState, mapDispatch)(Navbar)
