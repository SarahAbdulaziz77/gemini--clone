import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

// get the input from the user then display it
const ContextProvider = (props) =>{
    // used to save input data
    const [input,setInput] = useState("");
    // used to save the input into recent prompt
    const [recentPrompt,setRecentPrompt] = useState("");
    // array to store all the input history and display it in recent tap
    const [prevPrompt,setPrevPrompt] = useState([]);
    // if it's true, it will hide greet text and boxes and will show the result
    const [showResult,setShowResult] = useState(false);
    // if it's true, it will display loading animation and after getting data i will make it false
    const [loading,setLoading] = useState(false);
    // display the result in the web page
    const [resultData,setResultData] = useState("");

    const delayPara = (index,nextWord) => {
        setTimeout(function (){
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const onSent = async (prompt) => {
        // prev response will be removed from our state var 
        setResultData("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)
        const response = await run(input) 
        // the array will store our response using the split method
        let responseArray = response.split("**");
        let newResponse;
        for(let i =0 ; i < responseArray.length; i++)
        {
            // we will iterate each word that will be seperated with the **
            if(i === 0 || i%2 !== 1){
                newResponse += responseArray[i];
            }
            else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length;i++){
            // we will add words one by one
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
        setLoading(false) //hiding the loading animation
        setInput(" ") //reset the input field
    }


    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        setInput
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider