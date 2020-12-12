import { useState } from 'react';

const useToggle = (initialValue: boolean): [boolean, ()=>void, (state: boolean)=>void] => {

    const [state, setState] = useState(initialValue);

    const toggleState = () => setState(s => !s);

    return [state, toggleState, setState];
}

export default useToggle;