import {Link} from 'react-router-dom';

const BackButton = ({destination = '/'}) => {
    return (
        <div className='flex'>
            <Link 
            to = {destination}
            className='bg-sky-800 text-white px-4 py-1 rounded-lg w-fit'>
                <img 
                    src='https://i.ibb.co/j64G6h3/back-arrow.png' 
                    alt='Back' 
                    style={{ width: '32px', height: '32px' }}
                />
            </Link>
        </div>
    )
};

export default BackButton;