import React from 'react';

export default function (props) {
    console.log(props.fullName);
    return <div>Hello {props.fullName}</div>;
}