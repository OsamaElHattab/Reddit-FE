import React, { ReactNode } from 'react';
import { Button } from '@material-tailwind/react';

export default function RoundedButton(props: {
  buttonColor: string;
  buttonBorderColor: string;
  buttonText: string;
  buttonTextColor: string;
  children?: ReactNode;
}) {
  return (
    <Button
      style={{
        //backgroundColor: props.buttonColor,
        color: props.buttonTextColor,
      }}
      color={props.buttonColor}
      className={`!border !normal-case  border-${props.buttonBorderColor}  rounded-full  hover:shadow-none focus:shadow-none shadow-none `}
      size='sm'
      ripple={false}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {props.children}
        {props.buttonText}
      </div>
    </Button>
  );
}
