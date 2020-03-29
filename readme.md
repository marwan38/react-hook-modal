# React Hook Modal

Install:
```
npm i @marwan38/react-hook-modal
OR
yarn add @marwan38/react-hook-modal
```

## Usage

```
// Make sure to extend IModalProps
interface SampleModalProps extends IModalProps {
    onSubmit: (...args: any) => void;
}
const SampleModal: React.FC<SampleModalProps> = ({stateKey, onSubmit}) = {  
    const state = useModalState(stateKey); // passed in dynamically by the provider when useModal is called. Contains the close method to close this modal
    const { dynamicData } = state;
    return (
        <div onClick={state.close}>
            I am Modal
        </div>
    );
}

const ModalLauncher = () => {
    const {open, close, setState} = useModal(
        SampleModal,
        {
            onSubmit: (args) => console.log(args)
        }, // optional static props
        {
            dynamicData: []
        }, // optional state. Accessed with the useModalState hook. Set by the setState function
    );
    return (
        <button onClick={() => setState('dynamicData', [1,2,3])}>Add to state</button>
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
setState(key, value); // Keys are defined in the state argument of useModal.
```

### useModalState(stateKey);
```
// Use within the modal component to access its state
const { close, ...rest } = useModalState(stateKey); // State key is passed down through the props of the modal passed in the useModal() 1st argument.
close() is always passed down through the state
```

### ModalRoot (Helper component)

```
<ModalRoot stateKey={stateKey} />

interface ModalRootProps extends IModalProps {
  modalContainerAnim?: Animation;
  overlaySpringConfig?: SpringConfig;
  children: ((args: ModalRootChildProps) => React.ReactNode) | React.ReactNode;
}

```