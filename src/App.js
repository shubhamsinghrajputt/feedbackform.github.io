import React, { useEffect } from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { json } from 'react-router-dom';

function App() {
  // input states
  const[userName,setUserName]=React.useState('')
  const[userMessage,setUserMessage]=React.useState('')

  // response state
  const [messageList, setMessageList] = React.useState([])

    // re recieve messages from server
  const [getMessages, setGetMessages] = React.useState(true)

    // send message to server
  const handleSubmitFeedback =() =>{

    if(userName==='' && userMessage===''){
      alert("Please enter the fields")
      return;
    }

    /** Creating the POSt request to the server here method :'POST' denotes what kind of request making and 
     * headers:{
     * 'Content-Type':'application/json'}
     * denotes that what content and in which format we are sending to the server 
     * body:JSON.stringify ({
     * userName=userName,
     * userMessage:userMessage
     * }) denotes that with help of JSON.stringify we are converting the posting data into string data type
     * where as userName and userMessage set to sending the data symonteniously
    */
    fetch('https://feedback-4cbfa-default-rtdb.asia-southeast1.firebasedatabase.app/feedback.json',
         {method:'POST',

         headers:{
        'Content-Type' : 'application/json'
                 },
        body:JSON.stringify(
        {
        userName:userName,
        userMessage:userMessage
        }
                           )
      }
        )

/** here in .then(res=>res.json) recieve the data and with the help of res.json the data will be unwrapped 
 * and the .then(data=>{
 * console.log(data)})
 * will consol the data that we recieved from data base and setUserName and setUSerMessage is set to null because when we recieved the data 
 * the input fields will set to empety 
 */

        .then(res=>res.json)
        .then(data=>{
          console.log(data)
          setUserMessage('')
          setUserName('')

          //we set he getMessage to true just to let the useEffect run ahead
          setGetMessages(true)
        })
  }

    // get messages from server
  useEffect(() => {
    //useEffect hook will run for the first time because we placed 'getMessage' in 'if' condition and set it to true when we created the 
    //'useEffect' hook 
    if(getMessages) {
      //fetching the data
      fetch('https://feedback-4cbfa-default-rtdb.asia-southeast1.firebasedatabase.app/feedback.json')
      //unwrapping the data using .json function
      .then(res => res.json())
      //getting the data outside of it 
      .then(data => {
        console.log(data)
        //created an empty array 
        const loadedFeedback = [];
        //running loop
        for(const key in data) {
          //pusing the data in array
          loadedFeedback.push({
            //pusing the data in array format
            id: key,
            userName: data[key].userName,
            userMessage: data[key].userMessage,
          })
        }
        console.log(loadedFeedback)
        //setting the state by giving the data in array format
        setMessageList(loadedFeedback)
      })
      //setting the state to false because when the render happens it would not go under infinite loop becuase of getting true in if condition

      setGetMessages(false)
    }
  },
  //here we give the dependency to a useState hook 'getMessage' but not the 'messageList' because it would go under infnite loop because 
  //dependency would chnage everytime when renders happens
   [getMessages])
  

  return (
    <div className='app-container'>
      <div className='form-container'>
        <h2>Feedback Form</h2>
      <TextField
          required
          id="outlined-required"
          label="Full Name"
          value={userName}
          /**here we are setting the useName because when we click the submit button the input field must go emety and for that cause 
           * we are setting the userName because userName and userMessage set to null in fet request in fetch function
           */
          onChange={(e)=>setUserName(e.target.value)}
          /**by this even listner we set the userName to the input given by the user  */
        />

      <TextField
          id="outlined-textarea"
          label="Feedback"
          placeholder="Placeholder"
          multiline
          rows={10}
          value={userMessage}
          onChange={(e)=>setUserMessage(e.target.value)}
        />
      
      <Button variant="contained"
       onClick={
        handleSubmitFeedback
          }>
        Submit</Button>
</div>

<div className='feedback-container'>
        {
          messageList && messageList.map((item, index) => {
            return (
              <div className='feedback-item' key={index}>
                <h3>{item.userName}</h3>
                <p>{item.userMessage}</p>
              </div>
            )
          })
        }
      </div>
      
    </div>
  );
}

export default App;
