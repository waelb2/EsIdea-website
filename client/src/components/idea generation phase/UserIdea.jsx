import React, { useState, useEffect } from 'react';

const UserIdea = ({ ideas, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIndex, setEditedIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [updatedIdeas, setUpdatedIdeas] = useState([]);
  const user = ideas[0].createdBy
  useEffect(() => {
    setUpdatedIdeas([...ideas]);
  }, [ideas]);

  const activateEditMode = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedIndex !== null && editedText.trim() !== "") {
      const updated = updatedIdeas.map((idea, index) => {
        if (index === editedIndex) {
          return { ...idea, text: editedText };
        }
        return idea;
      });
      setUpdatedIdeas(updated);
      setIsEditing(false);
      setEditedIndex(null);
      setEditedText("");
    }
  };

  const handleEdit = (index, text) => {
    setEditedIndex(index);
    setEditedText(text);
  };


  return (
    <div className="bg-[#FEFEFE] p-4 m-2 rounded-2xl shadow-md hover:shadow-lg border border-black max-w-[400px] group hover:icons">
      <div className='flex items-center justify-between'>
        <p className='font-medium'> {user.firstName}  thinks :</p>
        <div className='flex items-center justify-between w-9 icons opacity-0 group-hover:opacity-100'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 cursor-pointer" onClick={activateEditMode}>
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 cursor-pointer"onClick={() => onDelete(ideas[0].ideaId)}>
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {updatedIdeas.map((idea, index) => (
        <div key={index} >
          {(isEditing && editedIndex === index) ? (
            <div>
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button onClick={handleSave} className='ml-1 bg-skyBlue rounded-md w-16 border text-white font-medium'>Save</button>
            </div>
          ) : (
            <p className="relative mt-2 pl-1.5 text-sm" style={{ color: idea.color}} onClick={() => handleEdit(index, idea.content)}>
              <span className="absolute left-0 top-0">&#8226;</span> 
              <span className="overflow-hidden whitespace-pre-wrap break-words ml-2" style={{fontWeight: idea.isBold ? 'bold' : 'normal', fontStyle: idea.isItalic ? 'italic' : 'normal'}}>
                {idea.content}
              </span>
          </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserIdea;
