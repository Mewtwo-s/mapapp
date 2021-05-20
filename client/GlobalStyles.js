import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;800;900&family=Rubik:wght@800&display=swap');
*{
    margin: 1px;
    padding: 1px;
    box-sizing: inherit;
}
html {
    box-sizing: border-box;
    font-size: 62.5%;
    @media only screen and (max-width: 1200px){
        font-size: 58%;
    }
    @media only screen and (min-width: 1980px){
        font-size: 70%;
    }
     @media only screen and (max-width: 600px){
        font-size: 45%;
    }
}
body{
    font-family: 'Nunito', sans-serif;
    font-weight: 400;
    line-height: 1.6;
    font-size: 1.6rem;
    background: #faf1e6;
    color: #333;
}
`;

export default GlobalStyles;


export const Container = styled.div`
margin: 0 auto;
padding: 0 30px;
max-width: 1300px;
width: 100%;
@media screen & (max-width:600px){
    padding: 0 10px;
}
@media screen & (max-width:991px) {
    padding: 0 30px;
}
@media screen & (min-width: 1500px) {
    max-width: 1400px;
}
`;


export const Button = styled.button`
  backgroundcolor: white;
  color: #51adcf;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #51adcf;
  border-radius: 3px;
  &:hover {
    backgroundcolor: #a5ecd7;
  } 
`;


export const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 1em;

`;

export const Input = styled.input`
  font-size: 16px;
  border: solid 0.5px #dbdbdb;
  border-radius: 3px;
  color: orange;
  padding: 7px 33px;
  border-radius: 3px;
  color: #999;
  cursor: text;
  font-size: 14px;
  font-weight: 300;
  text-align: left;
  background: #fafafa;
 
  &:active,
  &:focus {
    text-align: left;
  };

  &:focus::-webkit-input-placeholder {
  transition: opacity 0.4s 0.4s ease!important;
  opacity: 0.40;
  }
`;

export const Label = styled.label`
	margin-bottom: 0.25em;
	color: white;
`;
