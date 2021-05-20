import React from 'react'
import styled from 'styled-components'
import { Container } from '../GlobalStyles';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <Nav>
    <NavbarContainer>
      <h4>The Map App</h4>
      {isLoggedIn ? (
        <NavMenu>
          {/* The navbar will show these links after you log in */}
          <NavLink to="/home">Home</NavLink> 
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </NavMenu>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
        </div>
      )}
    </NavbarContainer>
    <hr />
  </Nav>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

 const Nav = styled.nav` 
font-size: 18px;
position: sticky;
top: 0;
z-index: 999;
height: 80px;
background-color: #a5ecd7;
/* box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.5); */
box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
display: flex;
justify-content: center;
align-items: center;
`;

 const NavbarContainer = styled(Container)`
display: flex;
justify-content: space-between;
align-items: center;
height: 80px;
${Container};
`;

const NavLink = styled(Link)`
text-decoration: none;
font-weight: bold;
font-size: 2rem;
color: #0f3057;
padding: 1rem 2rem;
height: 100%;
transition: all .2s ease;
&:hover {
    color: #51adcf;
    transform: traslateY(-3rem);
    
}
&:active {
    transform: traslateY(3rem);
    color: #32e0c4;
}

`;

const NavMenu = styled.div`
display: flex;
align-items: center;
text-align: center;
`;

export default connect(mapState, mapDispatch)(Navbar)
