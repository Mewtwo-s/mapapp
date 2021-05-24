import React from 'react';
import { connect } from 'react-redux';
import { directionsFailed } from '../store/directionsFailure';

class DirectionsFailure extends React.Component {
    constructor () {
        super();
        this.handleClick=this.handleClick.bind(this);
    }
    
    handleClick () {
        this.props.directionsFailed(false);
    }

    render() {
        return (
            <div className="modal">
                <div className="modal_content">
                    <span className="close" onClick={this.handleClick}>
                    &times;
                    </span>
                        <h3>Sorry, this route is not possible!</h3>
                </div>
            </div>
        );
    }
}

const mapDispatch = (dispatch) => {
    return {
      directionsFailed: (value) => dispatch(directionsFailed(value))
    };
  };
  
  
  export default connect(null, mapDispatch)(DirectionsFailure);