1. What is the difference between Component and PureComponent?
   Give an example where it might break my app.

A Component is the base class in React for creating components. It re-renders whenever its parent re-renders, regardless of whether its props have changed. A PureComponent, on the other hand, implements a shallow comparison of props and state to prevent unnecessary re-renders.

## Example where it might break my app:

If you pass an object as a prop that is modified directly without creating a new reference, a PureComponent may not re-render, leading to stale data being displayed.

import React, { useState } from 'react';

const Parent = () => {
const [user, setUser] = useState({ name: "Alice" });

const updateUser = () => {
user.name = "Bob"; // Mutating state directly
setUser(user); // PureComponent won't re-render
};

return (

<div>
<Child user={user} />
<button onClick={updateUser}>Update User</button>
</div>
);
};

const Child = React.memo(({ user }) => {
return <div>{user.name}</div>; // Will not update to "Bob"
});

2. Context + ShouldComponentUpdate might be dangerous. Why is
   that?

Using Context in conjunction with shouldComponentUpdate can lead to bugs because context changes do not trigger re-renders in components that implement shouldComponentUpdate unless their props change. If a component subscribes to context and uses shouldComponentUpdate, it may miss context updates if not properly handled, leading to stale or incorrect data being displayed.

3. Describe 3 ways to pass information from a component to its
   PARENT.

## Callback Functions:

The parent component can pass a function as a prop to the child. The child calls this function to send data back to the parent.

const Parent = () => {
const handleData = (data) => {
console.log(data);
};

return <Child onSendData={handleData} />;
};

const Child = ({ onSendData }) => {
return <button onClick={() => onSendData("Data from Child")}>Send Data</button>;
};

## Refs:

A parent can use refs to directly call methods on a child component, allowing it to retrieve information from the child.

import React, { useRef } from 'react';

const Parent = () => {
const childRef = useRef();

const getChildData = () => {
console.log(childRef.current.getData());
};

return (

<div>
<Child ref={childRef} />
<button onClick={getChildData}>Get Child Data</button>
</div>
);
};

const Child = React.forwardRef((props, ref) => {
React.useImperativeHandle(ref, () => ({
getData: () => "Data from Child",
}));

return <div>Child Component</div>;
});

## State Management (e.g., Redux or Context API):

Both the parent and child can access shared state, allowing the child to update the state that the parent can read.

import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

const Parent = () => {
const [data, setData] = useState(null);

return (
<MyContext.Provider value={{ data, setData }}>
<Child />
</MyContext.Provider>
);
};

const Child = () => {
const { setData } = useContext(MyContext);

return <button onClick={() => setData("Data from Child")}>Send Data</button>;
};

4. Give 2 ways to prevent components from re-rendering.

## Using React.memo:

Wrap your functional component with React.memo to prevent re-renders if the props haven’t changed.

const Child = React.memo(({ data }) => {
return <div>{data}</div>;
});

## Avoiding State Updates:

Ensure that you only update the state when necessary. Using functional updates with setState can help ensure that state updates are based on previous state values.

const Parent = () => {
const [count, setCount] = useState(0);

const increment = () => {
setCount((prevCount) => prevCount + 1); // Only updates if count is different
};

return (

<div>
<Child count={count} />
<button onClick={increment}>Increment</button>
</div>
);
};

5. What is a fragment and why do we need it? Give an example where it
   might break my app.

A fragment is a way to group multiple elements without adding extra nodes to the DOM. It is useful for returning multiple elements from a component without needing a wrapping div.

Example where it might break my app:
If you expect a single parent node for styling or layout purposes, using fragments may lead to layout issues.

const MyComponent = () => {
return (
<>

<h1>Hello</h1>
<h2>World</h2>
</>
);
};

6. Give 3 examples of the HOC pattern.

## WithRouter:

This HOC provides routing props to a component, allowing it to access route information.

import { withRouter } from 'react-router-dom';

const MyComponent = (props) => {
// Access props.router, props.history, etc.
};

export default withRouter(MyComponent);

## Connect (from Redux):

Connect maps state and dispatch to props for a component.

import { connect } from 'react-redux';

const MyComponent = ({ myData }) => {
return <div>{myData}</div>;
};

const mapStateToProps = (state) => ({
myData: state.myData,
});

export default connect(mapStateToProps)(MyComponent);

## Error Boundary HOC:

A higher-order component that wraps another component and catches JavaScript errors in its child component tree.

const withErrorBoundary = (WrappedComponent) => {
return (props) => {
try {
return <WrappedComponent {...props} />;
} catch (error) {
return <div>Error occurred</div>;
}
};
};

const MyComponent = withErrorBoundary((props) => {
return <div>{props.data}</div>;
});

7. What's the difference in handling exceptions in promises,
   callbacks and async...await?

## Promises:

Use .catch() to handle errors.

fetch(url)
.then(response => response.json())
.catch(error => console.error(error));

## Callbacks:

Errors must be passed to the callback function.

const fetchData = (callback) => {
// Simulating an error
callback(new Error("Error!"), null);
};

fetchData((error, data) => {
if (error) console.error(error);
});

## Async/Await:

Use try/catch blocks to handle errors in a more synchronous style.

const fetchData = async () => {
try {
const response = await fetch(url);
const data = await response.json();
} catch (error) {
console.error(error);
}
};

8. How many arguments does setState take and why is it async.

setState in functional components is actually useState, which takes one argument: the new state value (or a function that returns it). It is asynchronous to batch updates for performance reasons, allowing React to optimize rendering.

const [state, setState] = useState(initialValue);

setState(newValue);

9. List the steps needed to migrate a Class to Function
   Component.

1. Change the class definition to a function.
1. Replace lifecycle methods with useEffect.
1. Replace this.state with the useState hook.
1. Replace this.setState with the updater function returned by useState.
1. Remove this references, using props and state directly.
1. Adapt event handlers and methods to use functional style.

1. List a few ways styles can be used with components.

## Inline Styles:

Using the style attribute directly in the JSX.

const MyComponent = () => {
return <div style={{ color: 'red' }}>Hello</div>;
};

## CSS Modules:

Creating scoped CSS styles for components.

import styles from './Component.module.css';

const MyComponent = () => {
return <div className={styles.container}>Hello</div>;
};

## Styled Components:

Using the styled-components library to create styled components.

import styled from 'styled-components';

const StyledDiv = styled.div`  color: blue;`;

const MyComponent = () => {
return <StyledDiv>Hello</StyledDiv>;
};

## CSS-in-JS Libraries:

Libraries like Emotion or JSS that allow you to write CSS directly in your JavaScript.

/\*_ @jsxImportSource @emotion/react _/
import { css } from '@emotion/react';

const MyComponent = () => {
return <div css={css`color: green;`}>Hello</div>;
};

## External Stylesheets:

Linking a CSS file in the HTML and using class names in the component.

import './styles.css';

const MyComponent = () => {
return <div className="my-class">Hello</div>;
};

11. How to render an HTML string coming from the server.

To render an HTML string coming from the server, you can use the dangerouslySetInnerHTML property in a React component. This property allows you to set HTML directly in the DOM, but you should use it with caution due to potential XSS (Cross-Site Scripting) risks.

Here's an example:

import React from 'react';

const MyComponent = ({ htmlString }) => {
return (

<div dangerouslySetInnerHTML={{ __html: htmlString }} />
);
};

const ParentComponent = () => {
const htmlFromServer = "<h1>Hello World</h1><p>This is an HTML string from the server.</p>";

return (
<MyComponent htmlString={htmlFromServer} />
);
};

## Caution:

Always sanitize any HTML strings coming from the server to prevent XSS attacks. You can use libraries like dompurify to clean the HTML string before rendering it.

import React from 'react';
import DOMPurify from 'dompurify';

const MyComponent = ({ htmlString }) => {
const cleanHtml = DOMPurify.sanitize(htmlString);

return (

<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
);
};
