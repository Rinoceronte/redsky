import React from 'react';
import {IUser} from '../interface';

const User = (props: any): any => {
    return <section className='user'>
            <h1>{props.first_name} {props.last_name}</h1>
            <h2>{props.email}</h2>
            <img className='user-avatar' src={props.avatar} alt={`${props.first_name} {props.last_name}`} />
            <button onClick={_ => props.setEdit(props.id)}>Edit</button>
            <button onClick={_ => props.delete(props.id)}>Delete</button>
        </section>
}

export default User;

