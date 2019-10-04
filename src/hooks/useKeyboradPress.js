import { useState, useEffect } from 'react';

const useKeyboradPress = (targetKeyCode) => {
    const [keyPress, setKeyPress] = useState(false);
    const handleKeyDown = ({keyCode}) => {
        if(keyCode === targetKeyCode){
            setKeyPress(true)
        }
    }
    const handleKeyUp = ({keyCode}) => {
        if(keyCode === targetKeyCode){
            setKeyPress(false)
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    })

    return keyPress;
}

export default useKeyboradPress;