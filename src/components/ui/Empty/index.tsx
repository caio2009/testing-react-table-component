import React from 'react';

type EmptyProps = {
  message: string;
}

const Empty: React.FC<EmptyProps> = (props) => {
  const { message } = props;

  return (
    <div>
      <h3>{message}</h3>
    </div>
  );
};

export default Empty;
