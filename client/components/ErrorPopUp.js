import React from 'react';
import { connect } from 'react-redux';
import { emitErrorMessage } from '../store/error';

class ErrorPopUp extends React.Component {
    constructor () {
        super();
        this.handleClick=this.handleClick.bind(this);
    }
    
    handleClick () {
        this.props.directionsFailed(null);
    }

    render() {
        console.log(this.props.errorMessage);
        return (
            <div className="modal">
                <div className="modal_content">
                    <span className="close" onClick={this.handleClick}>
                    &times;
                    </span>
                        <h3>{this.props.error}</h3>
                </div>
            </div>
        );
    }
}

const mapState = (state) => {
    return {
      error: state.errorMessage
    };
  };

const mapDispatch = (dispatch) => {
    return {
      clearError: (value) => dispatch(emitErrorMessage(value))
    };
  };
  
  
  export default connect(mapState, mapDispatch)(ErrorPopUp);