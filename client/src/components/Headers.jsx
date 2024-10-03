import { Navbar, TextInput, Button, Dropdown, Avatar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux';
import {toggleTheme} from '../redux/theme/themeSlice'

export default function Headers() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const {currentUser} = useSelector(state => state.user)

  return (
    <Navbar className="border-b-2" fluid rounded>
      <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span className="px-2 py-1 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg text-white">Usama's</span>
        <span>Blog</span>
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>

      <Button className="w-12 h-10 lg:hidden" color="red" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 px-10 lg:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="red" pill onClick={()=>dispatch(toggleTheme())}>
          <FaMoon />
        </Button>
        {currentUser? (
          <Dropdown
          className=''
            arrowIcon={false}
            inline
            label={
              <Avatar
              alt='user'
              img={currentUser.profilePicture}
              rounded
            />
          }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
            Profile
            </Link>
            <Dropdown.Divider/>
            <Dropdown.Item>
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ):(
          <Link to="sign-in">
            <Button className="bg-gradient-to-r from-cyan-900 to-blue-900">Sign In</Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      {/* Make sure the links are visible */}
      <Navbar.Collapse className="md:flex md:items-center md:space-x-4 md:w-auto">
        <Navbar.Link className={`${path==='/'? 'text-blue-600' : ''}`} active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link className={`${path==='/projects'? 'text-blue-600' : ''}`} active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
        <Navbar.Link className={`${path==='/about'? 'text-blue-600' : ''}`} active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
