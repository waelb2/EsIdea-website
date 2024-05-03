import React , {useState} from 'react'
import UserIdea from '../idea generation phase/UserIdea'
import Back from '../../assets/Back.png'
import Line from '../../assets/Line 3.png'
import Download from '../../assets/Download from the Cloud.png'
import Avatar from '../../assets/avatar-with-background.png'
import Bold from '../../assets/Bold.png'
import Italic from '../../assets/Italic.png'
import Clear from '../../assets/Clear Symbol.png'
import Color from '../../assets/Color Mode.png'
import Line1 from '../../assets/Line 1.png'
import Brain from '../../assets/Brain.png'
import Attach from '../../assets/Attach.png'
import Send from '../../assets/Send.png'
import { useSearchParams } from 'react-router-dom'
import useUser from '../../hooks/useUser'

const AdminBrainWriting = () => {

    const [textInput, setTextInput] = useState('');
    const [userThoughts, setUserThoughts] = useState([]);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
  
    const handleSend = () => {
      if (textInput.trim() !== '') {
        setUserThoughts(prevUserThoughts => [
          ...prevUserThoughts,
          {
            text: textInput,
            isBold,
            isItalic
          }
        ]);
        setTextInput('');
      }
    };
  
    const toggleBold = () => {
      setIsBold(!isBold)
    }
  
    const toggleItalic = () => {
      setIsItalic(!isItalic)
    }
  
    const clearIdeas = () => {
      setUserThoughts([]);
    };
    const [searchParams,setSearchParams] = useSearchParams();
    const ProjectTitle = searchParams.get("ProjectTitle");
    const user = useUser();
    const MainTopic = searchParams.get("MainTopic");
    return (
    <div className='h-screen bg-[#F1F6FB] relative py-36'>
        <div className='flex justify-between items-center py-4 px-5 fixed top-0 left-0 right-0'>
          <div className='bg-white border border-black flex justify-between items-center px-2 w-56 h-10 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.2)]'>
            <a href="#"><img src={Back}/></a>
            <p className='font-medium'>{ProjectTitle}</p>
            <img src={Line} className='h-6'/>
            <img src={Download}/>
          </div>
          <div className='flex items-center'>
            <div className='flex items-center justify-center mr-4 bg-white font-medium h-10 w-32 rounded-full border border-black shadow-[0_4px_4px_rgba(0,0,0,0.2)]'>5 round left</div>
            <div className='flex items-center justify-center mr-4 bg-white font-medium h-10 w-32 rounded-full border border-black shadow-[0_4px_4px_rgba(0,0,0,0.2)]'>15:29:30 left</div>
          </div>
        </div>

        <div className='flex flex-col items-end absolute right-0'>
          <div className='flex items-center bg-white h-8 w-14 border border-black rounded-l-full pl-4'>
            <img className='rounded-full h-6' src={user.user.profilePicUrl}/>
            <p className='ml-2 hidden'>{`${user.user.firstName}`}</p>
          </div>

          <div className='flex items-center bg-white h-8 w-14 border border-black rounded-l-full pl-4'>
            <img src={Avatar}/>
            <p className='ml-2 hidden '>User</p>
          </div>

          <div className='flex items-center bg-white h-8 w-14 border border-black rounded-l-full pl-4'>
            <img src={Avatar}/>
            <p className='ml-2 hidden '>User</p>
          </div>

          <div className='bg-gradient-to-r from-[#599FF8] to-[#263238] py-1 pl-1  rounded-l-full'>
            <div className='flex items-center bg-white h-8 w-28  rounded-l-full pl-4' >
              <img src={Avatar}/>
              <p className='ml-2'>User 1</p>
            </div>
          </div>

          <div className='flex items-center bg-white h-8 w-14 border border-black rounded-l-full pl-4'>
            <img src={Avatar}/>
            <p className='ml-2 hidden '>User</p>
          </div>
        </div>
  
        <div className='text-center w-80 absolute left-1/2 transform -translate-x-1/2 top-8'>
          <p className='text-3xl font-medium'>{MainTopic}</p>
          <p className=''>Use the prompt bellow to add your ideas about this theme</p>
        </div>
  
        <div className='flex flex-col gap-1 bg-white fixed rounded-full px-2 py-3 top-1/2 transform -translate-y-1/2 ml-5'>
          <img src={Bold}  className='w-6' onClick={toggleBold} style={{ cursor: 'pointer', background: isBold ? 'rgba(120, 120, 120 , 0.4)' : 'white' }}/>
          <img src={Line1} className='w-6'/>
          <img src={Italic} className='w-6' onClick={toggleItalic} style={{cursor: 'pointer', background: isItalic ? 'rgba(120, 120, 120 , 0.4)' : 'white'}} />
          <img src={Line1} className='w-6'/>
          <img src={Color} className='w-6' />
          <img src={Line1} className='w-6'/>
          <img src={Clear} className='w-6' onClick={clearIdeas}/>
        </div>
  
            <div className=' w-full fixed bottom-0 h-24 flex justify-end items-start'>
              <div className='bg-white flex items-center w-1/2 rounded-full px-2 py-1'>
                    <img src={Brain} className='w-8' />
                    <input
                    type="text"
                    placeholder='What’s in your mind?...'
                    className='w-full  outline-none focus:outline-none'
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    style={{ fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal' }}
                    />
                    <div className='flex items-center '>
                    <img src={Attach} className='w-8' />
                    <div 
                        className='flex items-center justify-center rounded-full bg-[#59AEF8] p-2'
                        onClick={handleSend}
                    >
                        <img src={Send} className='w-8'/>
                    </div>
                    </div>
              </div>

              <div className='flex  items-center justify-center bg-skyBlue rounded-full w-40 h-10 mr-8 ml-40 cursor-pointer'>
                <p className='mr-4 text-white text-sm font-semibold'>END Ideation</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-skyBlue rounded-full bg-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" stroke-width="2" />
                </svg>
            </div>


            </div>
             
        {userThoughts.length > 0 && (
          <div className="flex flex-wrap w-5/6 ml-24" style={{ wordWrap: 'break-word' }}>
            <UserIdea ideas={userThoughts} />
          </div>
        )}
  
      </div>  
    )
}

export default AdminBrainWriting