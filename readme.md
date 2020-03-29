# React Hook Modal

Install:
```
npm i @marwan38/react-hook-modal
OR
yarn add @marwan38/react-hook-modal
```

## Usage

```
// Modal gets required props automatically passed through the provider
const SampleModal: React.FC<IModalProps & { aProp: boolean }> = ({stateKey, close, aProp}) = {  
    const { dynamicData } = useModalState(stateKey);
    return (
        <div onClick={close}>
            I am Modal
        </div>
    );
}

const ModalLauncher = () => {
    const {open, close, setState} = useModal(
        SampleModal,
        {
            aProp: true
        }, // Static (unchangable) props. Useful for callbacks
        {
            dynamicData: []
        }, // Accessed with the useModalState hook. Set by the setState function
    );

    const handleClick = () => {
        
        // setState returns the state passed in the 2nd argument of useModal
        setState((state) => {
            // setState uses immer under the hood!
            // so mutate away!
            // make sure to not return the value
            state.dynamicData.push('whatever');
        })
    }
    return (
        <button onClick={handleClick}>Add to state</button>
        <button onClick={open}>Open modal</button>
    );
}

```

## API

`<ModalProvider />`: Wrap the root of your app with this

### useModal(Component, props, state);
```
const { open, close, setState } = useModal(ModalRoot, {...props}, {...state});

open(); // Launches the modal
close(); // Closes the modal
setState((draftState) => {}); Mutate the draftState
```

### useModalState(stateKey);
You will have to manually pass an interface to it for typing. IE: `useModalState<State>(stateKey)`
```
// Use within the modal component to access its state
const state = useModalState(stateKey); // State key is passed down to the modal component
```

## CURRENTLY UNAVAILABLE
I havent figured out how to treeshake this component as I don't want to include react-spring as part of the package.
### ModalRoot (Helper component)

```
<ModalRoot stateKey={stateKey} close={close} />

interface ModalRootProps extends IModalProps {
  modalContainerAnim?: Animation;
  overlaySpringConfig?: SpringConfig;
  children: ((args: ModalRootChildProps) => React.ReactNode) | React.ReactNode;
}

```