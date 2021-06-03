import {useState} from 'react';
import {Errors} from '../interface';
const CreateUser = (props: any): any => {

    
    const [first_name, setFirst_Name] = useState<string>('');
    const [last_name, setLast_Name] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');
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

    const createUser = (): void => {
        const firstName: boolean = !checkName(first_name);
        const lastName: boolean = !checkName(last_name);
        const emailCheck: boolean = !checkEmail(email); 
        const submit = (firstName || lastName || emailCheck);
        setErrorInfo({firstName, lastName, email: emailCheck, submit});
        if(!firstName && !lastName && !emailCheck) {
            props.createUser({first_name, last_name, email, avatar});
            setEmail('');
            setFirst_Name('');
            setLast_Name('');
            setAvatar('');
        }
    }

    return <div className='create'>
        <section>
            <label>First Name</label>
            <input type="text" name="firstName" value={first_name} onChange={e => {
                                                                            setFirst_Name(e.target.value);
                                                                            setErrorInfo({...errorInfo, firstName: !checkName(e.target.value), submit: false});
                                                                        }} />
            {errorInfo.firstName && <label className='error'>Please use a valid first name</label>}
        </section>
        <section>
            <label>Last Name</label>
            <input type="text" name="lastName" value={last_name} onChange={e => {
                                                                                setLast_Name(e.target.value);
                                                                                setErrorInfo({...errorInfo, lastName: !checkName(e.target.value), submit: false});
                                                                            }} />
            {errorInfo.lastName &&  <label className='error'>Please use a valid last name</label>}
        </section>
        <section>
            <label>Email address</label>
            <input type="email" name="email" value={email} onChange={e => {
                                                                        setEmail(e.target.value);
                                                                        setErrorInfo({...errorInfo, email: !checkEmail(e.target.value), submit: false});
                                                                    }} />
            {errorInfo.email && <label className='error'>Enter a valid email address</label>}
        </section>
        <section>
            
            <label>Avatar URL</label>
            <input type="text" name="avatar" value={avatar} onChange={e => setAvatar(e.target.value)} />
        </section>
        <img src={avatar} alt="profile picture" />
        <button onClick={_ => createUser()}>Create User</button>
        {errorInfo.submit && <label className='error'>Please fix the above problems</label>}
    </div>
}

export default CreateUser;