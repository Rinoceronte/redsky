import axios from 'axios';
import {useState} from 'react';

import {IUser, Errors} from '../interface';

const EditUser = (props: any): any => {
    const [email, setEmail] = useState<string>(props.email);
    const [first_name, setFirst_Name] = useState<string>(props.first_name);
    const [last_name, setLast_Name] = useState<string>(props.last_name);
    const [avatar, setAvatar] = useState<string>(props.avatar);
    const [edited, setEdited] = useState<boolean>(false);
    const [errorInfo, setErrorInfo] = useState<Errors>({firstName: false, lastName: false, email: false, submit: false});

    const checkEmail = (emailString: string): boolean => {
        if(emailString === '' || !emailString) {
            return false;
        }
        var pattern = new RegExp(/^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/);
        return pattern.test(emailString);
    }

    const checkName = (name: string): boolean => {
        if(name === '' || !name) {
            return false;
        }
        let reg = new RegExp(/^[a-z ,.'-]+$/i);
        return reg.test(name);
    }

    const undo = (): void => {
        setEmail(props.email);
        setFirst_Name(props.first_name);
        setLast_Name(props.last_name);
        setAvatar(props.avatar);
        setEdited(false);
    }

    const save = (): void => {
        const firstName: boolean = !checkName(first_name);
        const lastName: boolean = !checkName(last_name);
        const emailCheck: boolean = !checkEmail(email); 
        const submit = (firstName || lastName || emailCheck);
        setErrorInfo({firstName, lastName, email: emailCheck, submit});
        if(!firstName && !lastName && !emailCheck) {
            props.finishEdit({id: props.id, first_name, last_name, email, avatar});
            setEdited(false);
        }
    }

    const cancel = (): void => {
        setEmail(props.email);
        setFirst_Name(props.first_name);
        setLast_Name(props.last_name);
        setAvatar(props.avatar);
        setEdited(false);
        props.cancel(props.id);
    }

    return <section className='editUser'>
        <img src={avatar} alt={`${first_name} ${last_name}`} />
        <section>
            <label>Avatar:</label>
                <input type="text" value={avatar} onChange={e => {
                    setAvatar(e.target.value);
                    setEdited(true);
                }}/>
        </section>
        <section>
            <label>First Name:</label>
            <input type="text" value={first_name} onChange={e => {
                    setFirst_Name(e.target.value);
                    setEdited(true);
                }
            } />
        </section>
        <section>
            <label>Last Name:</label>
            <input type="text" value={last_name} onChange={e => {
                    setLast_Name(e.target.value);
                    setEdited(true);
                }
            } />
        </section>
        <section>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => {
                    setEmail(e.target.value);
                    setEdited(true);
                }
            } />
        </section>
        {edited ? <section className='edited-buttons'>
                <button onClick={undo}>Undo</button>
                <button onClick={save}>Save Changes</button>
            </section> : <button onClick={cancel}>Cancel</button>}
    </section>
}

export default EditUser;