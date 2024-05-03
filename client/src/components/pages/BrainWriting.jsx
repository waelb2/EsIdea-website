import React, { useState, useEffect } from 'react';
import UserIdea from '../idea generation phase/UserIdea';
import IdeaEvaluation from '../idea generation phase/IdeaEvaluation';
import IdeaComment from '../Idea Comment/IdeaComment';
import Back from '../../assets/Back.png';
import Line from '../../assets/Line 3.png';
import Download from '../../assets/Download from the Cloud.png';
import User from '../Avatar/User';
import Bold from '../../assets/Bold.png';
import Italic from '../../assets/Italic.png';
import Clear from '../../assets/Clear Symbol.png';
import Color from '../../assets/Color Mode.png';
import Line1 from '../../assets/Line 1.png';
import Brain from '../../assets/Brain.png';
import Attach from '../../assets/Attach.png';
import Send from '../../assets/Send.png';
import CountdownTimerBW from '../Contdown Timer/CountdownTimerBW';

const BrainWriting = () => {
  const initialMinutes = 0;
  const initialSeconds = 5;
  const [rounds, setRounds] = useState(2);

  const [textInput, setTextInput] = useState('');
  const [userThoughts, setUserThoughts] = useState([]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showComment, setShowComment] = useState(false);
  const [countdownEnded, setCountdownEnded] = useState(false);
  const [userArray, setUserArray] = useState([
    { lastName: 'User1', imageUrl: '/images/avatar-with-background.png' },
    { lastName: 'User2', imageUrl: '/images/avatar-with-background.png' },
    { lastName: 'User3', imageUrl: '/images/avatar-with-background.png' },
    { lastName: 'User4', imageUrl: '/images/avatar-with-background.png' },
    { lastName: 'User5', imageUrl: '/images/avatar-with-background.png' },
  ]);

  const [activeUserIndex, setActiveUserIndex] = useState(0);
  
  const handleSend = () => {
    if (textInput.trim() !== '') {
      setUserThoughts(prevUserThoughts => [
        ...prevUserThoughts,
        {
          text: textInput,
          isBold,
          isItalic,
          color: selectedColor,
        },
      ]);
      setTextInput('');
      setIsBold(false);
      setIsItalic(false);
      setSelectedColor('#000000');
    }
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  const toggleBold = () => {
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };

  const handleColorChange = color => {
    setSelectedColor(color);
  };

  const clearIdeas = () => {
    setUserThoughts([]);
  };

  const handleDeleteAll = () => {
    setUserThoughts([]);
  };

  const toggleCommentPopup = () => {
    setShowComment(!showComment);
  };

  const handleCountdownEnd = () => {
    setActiveUserIndex(previousIndex => (previousIndex + 1) % userArray.length);
    if(activeUserIndex === userArray.length -1){
      setRounds(previousRound => previousRound-1);
    }
  };

  useEffect(() => {
    if(rounds === 0) setCountdownEnded(true);
  }, [rounds])

  return (
    <div className="h-screen bg-[#F1F6FB] relative py-36">
      <div className="flex justify-between items-center py-4 px-5 fixed top-0 left-0 right-0">
        <div className="bg-white border border-black flex justify-between items-center px-2 w-56 h-10 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
          <a href="#">
            <img src={Back} />
          </a>
          <p className="font-medium">Project title</p>
          <img src={Line} className="h-6" />
          <img src={Download} />
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center mr-4 bg-white font-medium h-10 w-32 rounded-full border border-black shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
            {rounds} round{rounds > 1 ? 's' : ''} left
          </div>
          <div className="flex items-center justify-center gap-2 mr-4 bg-white font-medium h-10 w-32 rounded-full border border-black shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
            <CountdownTimerBW initialMinutes={initialMinutes} initialSeconds={initialSeconds} countdownEnded={countdownEnded} onCountdownEnd={handleCountdownEnd} />
            left
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end absolute right-0">
        {userArray.map((user, index) => (
          <User key={index} userName={user.lastName} imageUrl={user.imageUrl} useGradientBorder={index === activeUserIndex} showName={index === activeUserIndex} />
        ))}
      </div>

      <div className="text-center w-80 absolute left-1/2 transform -translate-x-1/2 top-8">
        <p className="text-3xl font-medium">The theme</p>
        <p className="">Use the prompt bellow to add your ideas about this theme</p>
      </div>

      <div className="flex flex-col gap-1 bg-white fixed rounded-full px-2 py-3 top-1/2 transform -translate-y-1/2 ml-5">
        <img src={Bold} className="w-6" onClick={toggleBold} style={{ cursor: 'pointer', background: isBold ? 'rgba(120, 120, 120 , 0.4)' : 'white' }} />
        <img src={Line1} className="w-6" />
        <img src={Italic} className="w-6" onClick={toggleItalic} style={{ cursor: 'pointer', background: isItalic ? 'rgba(120, 120, 120 , 0.4)' : 'white' }} />
        <img src={Line1} className="w-6" />

        <label htmlFor="color-picker">
          <img src={Color} className="w-6 cursor-pointer" />
        </label>
        <input type="color" id="color-picker" value={selectedColor} onChange={e => handleColorChange(e.target.value)} className="hidden" />

        <img src={Line1} className="w-6" />
        <img src={Clear} className="w-6" onClick={clearIdeas} />
      </div>

      <div className="w-full fixed bottom-0 h-24 flex justify-center items-start">
        <div className="bg-white flex items-center w-1/2 rounded-full px-2 py-1">
          <img src={Brain} className="w-8" />
          <input
            type="text"
            placeholder="What’s in your mind?..."
            className="w-full  outline-none focus:outline-none"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal', color: selectedColor }}
          />
          <div className="flex items-center">
            <img src={Attach} className="w-8" />
            <div className="flex items-center justify-center rounded-full bg-[#59AEF8] p-2">
              <img src={Send} className="w-8" />
            </div>
          </div>
        </div>
      </div>

      {userThoughts.length > 0 && (
        <div className="flex flex-wrap w-5/6 ml-24" style={{ wordWrap: 'break-word' }}>
          {countdownEnded ? (
            <>
              <IdeaEvaluation ideas={userThoughts} toggleCommentPopup={toggleCommentPopup} />
              {showComment && <IdeaComment onClose={toggleCommentPopup} />}
            </>
          ) : (
            <UserIdea ideas={userThoughts} onDeleteAll={handleDeleteAll} />
          )}
        </div>
      )}
    </div>
  );
};

export default BrainWriting;