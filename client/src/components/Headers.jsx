import { Navbar, TextInput, Button } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';

export default function Headers() {
  const path = useLocation().pathname;
  return (
    <Navbar className='border-b-2'>
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
          <span className='px-2 py-1 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg text-white'>
            Usama's
          </span>
          <span>Blog</span>
        </Link>
        <form>
          <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
          />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='red' pill>
        <AiOutlineSearch />
        </Button>
        <div className='flex gap-2 px-10 md:order-2'>
          <Button className='w-12 h-10 hidden sm:inline' color='red' pill>
            <FaMoon/>
          </Button>
          <Link to='sign-in'>
          <Button className='bg-gradient-to-r from-cyan-500 to-blue-500'>Sign In</Button>
          </Link>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === '/'} as={'div'}>
            <Link to='/'>
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === 'projects'} as={'div'}>
            <Link to='/projects'>
              Projects
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === 'about'} as={'div'}>
            <Link to='/about'>
              About
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  );
}
