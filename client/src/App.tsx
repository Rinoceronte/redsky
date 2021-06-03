import {useEffect, useState} from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditUser from './components/EditUser';
import User from './components/User';
import CreateUser from './components/CreateUser';
import {IUser, IResult, BaseUser} from './interface';
import './style.css';

const defaultUsers: IUser[] = [];
const defaultEditedUsers: number[] = [];

function App() {
  const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(true);
  const [users, setUsers]: [IUser[], (users: IUser[]) => void] = useState(defaultUsers);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResult, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingUser, setEditingUser] = useState<number>(0);
  const [jumpToPage, setJumpToPage] = useState<number>(0);

  // useEffect(() => {
  //   axios.get<IResult>('/api/users')
  //   .then(({data}) => {
  //     const {total_pages, total} = data;
  //     setTotalPages(total_pages);
  //     setUsers(data.users);
  //     setTotalResults(total);
  //     setLoading(false);
  //   }).catch(err => console.log(err));
  // }, []);

  useEffect(() => {
    console.log(currentPage);
    axios.get<IResult>(`/api/users?page=${currentPage}`)
    .then(({data}) => {
      const {total_pages, total} = data;
      setTotalPages(total_pages);
      setUsers(data.users);
      setTotalResults(total);
      setEditingUser(0);
      setLoading(false);
    }).catch(err => console.log(err));
  }, [currentPage])

  const finishEdit = (updatedUser: IUser):void => {
    if(updatedUser.id === editingUser) {
      setLoading(true);
      axios.put('/api/users', updatedUser).then(({data}) => {
        const {total_pages, total} = data;
        setTotalPages(total_pages);
        setUsers(data.users);
        setTotalResults(total);
        setEditingUser(0);
        setLoading(false);
      })
      setEditingUser(0);
    }
  }

  const setEdit =(id:number):void => {
    if(editingUser !== 0) {
      window.confirm('Are you sure you want to navigate away from this user your changes will be lost?');
    }
    setEditingUser(id);
  }

  const cancelEdit = (id: number):void => {
    if(id === editingUser) {
      setEditingUser(0);
    }
  }

  const createUser = (user: BaseUser): void => {
    setLoading(true);
    axios.post('/api/users', user).then(({data}) => {
      const {total_pages, total} = data;
        setTotalPages(total_pages);
        setUsers(data.users);
        setTotalResults(total);
        setEditingUser(0);
        setLoading(false);
    });
  }

  const deleteUser = (id: number): void => {
    setLoading(true);
    axios.delete(`/api/users/${id}`).then(({data}) => {
      const {total_pages, total} = data;
        setTotalPages(total_pages);
        if(total_pages < currentPage) {
          setCurrentPage(total_pages);
        }
        setUsers(data.users);
        setTotalResults(total);
        setEditingUser(0);
        setLoading(false);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Red Sky</h1>
      </header>
      {loading && <CircularProgress />}
        <CreateUser createUser={createUser}/>
      <div className="users">
        {users.map((user, index) => {
            return (
              editingUser !== user.id ? 
              <User key={user.id} id={user.id} first_name={user.first_name} last_name={user.last_name} email={user.email} avatar={user.avatar} setEdit={setEdit} delete={deleteUser}/> : 
              <EditUser key={user.id} id={user.id} first_name={user.first_name} last_name={user.last_name} email={user.email} avatar={user.avatar} finishEdit={finishEdit} cancel={cancelEdit}/>
            );
          }
        )}
      </div>
      <section className='pages-navigation'>
          <section>
            <button onClick={_ => {if(currentPage > 1) { setCurrentPage(c => c-1)}}} disabled={currentPage === 1}>Previous</button>
            <span>{currentPage} of {totalPages}</span>
            <button onClick={_ => {if(currentPage !== totalPages) { setCurrentPage(c => c+1)}}} disabled={currentPage === totalPages}>Next</button>
          </section>
          <section>
            <label>Jump to</label>
            <input type="number" onChange={e => {
              if(+e.target.value <= totalPages && +e.target.value > 0) {
                setJumpToPage(+e.target.value);
              } else {
                setJumpToPage(totalPages);
              }
            }} 
            value={jumpToPage} 
            onKeyPress={e => {
              if(e.key === 'Enter'){
                setCurrentPage(jumpToPage); 
                setJumpToPage(1); 
              }}}/>
            <button onClick={_ => {
                setCurrentPage(jumpToPage); 
                setJumpToPage(1);
              }}>Go</button>
          </section>
      </section>
    </div>
  );
}

export default App;
