import { useState } from 'react';

export type ToggleState = [boolean, () => void, (state: boolean) => void]

const useToggle = (initialValue: boolean): ToggleState => {

    const [state, setState] = useState(initialValue);

    const toggleState = () => setState(s => !s);

    return [state, toggleState, setState];
}

export default useToggle;