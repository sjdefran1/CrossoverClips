import React from "react";

class DateChosen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <p>{this.props.date.toString()}</p>
      </>
    );
  }
}

export default DateChosen;
