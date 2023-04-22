import React, { RefObject, useEffect, useState } from 'react'
import { useTwitchApi } from '../../hooks/UseAPI'
import useDynamicRefs from 'use-dynamic-refs'


interface UsernameMenuProps {
   input: any,
   setInput: any,
   chatRef: any,
   chatters: string[],
   currentWord: string
}

export const UsernameMenu = ({ input, setInput, chatRef, chatters, currentWord }: UsernameMenuProps) => {
   
   const [showUserList, setShowUserList] = useState<boolean>(false)
   const [usernameAutocompletionText, setUsernameAutocompletionText] = useState<string | null>(null)
   const [usernameAutocompletionResults, setUsernameAutocompletionResults] = useState<string[] | null>(null)
   
   const [highlightedItem, setHighlightedItem] = useState<any>(null)
   
   const [getRef, setRef] = useDynamicRefs()
   
   
   /** Check for user mention */
   useEffect(() => {
      if (currentWord && currentWord[0] === '@') {
         setShowUserList(true)
         setUsernameAutocompletionText(currentWord.replace('@', ''))
      } else {
         setShowUserList(false)
         setUsernameAutocompletionText(null)
      }
   }, [currentWord])
   
   /**
    * User mention
    */
   useEffect(() => {
      setHighlightedItem(null)
      if (usernameAutocompletionText) {
         
         
         let results = chatters?.filter((user, index) => user.includes(usernameAutocompletionText.toLowerCase()))
         
         results = results.sort(function (a, b) {
            return a.length - b.length
         })
         
         setUsernameAutocompletionResults(results.slice(0, 100))
         
      }
   }, [usernameAutocompletionText])
   
   useEffect(() => {
      if (highlightedItem) {
         // @ts-ignore
         getRef('ul')?.current?.scrollTop = getRef(highlightedItem?.toString())?.current?.offsetTop - 80
      } else {
         // @ts-ignore
         getRef('ul')?.current?.scrollTop = 0
      }
   }, [usernameAutocompletionResults, highlightedItem])
   
   
   /**
    * Autocomplete on Enter
    * @param {any} key
    */
   function downHandler({ key }: any) {
      if ((key === 'Enter' || key === 'Tab') && usernameAutocompletionResults && currentWord[0] === '@') {
         autocompleteMention(usernameAutocompletionResults[highlightedItem])
      }
      if (key === 'ArrowUp' && highlightedItem != null && usernameAutocompletionResults) {
         const newIndex = highlightedItem - 1
         if (newIndex >= 0) {
            setHighlightedItem(newIndex)
         }
      }
      if (key === 'ArrowDown' && highlightedItem != null && usernameAutocompletionResults) {
         const newIndex = highlightedItem + 1
         if (newIndex <= usernameAutocompletionResults.length - 1) {
            setHighlightedItem(newIndex)
         }
      }
      
   }
   
   
   useEffect(() => {
      window.addEventListener("keydown", downHandler)
      
      return () => {
         window.removeEventListener("keydown", downHandler)
      }
   })
   
   useEffect(() => {
      if (usernameAutocompletionResults) {
         if (!highlightedItem) {
            setHighlightedItem(usernameAutocompletionResults.indexOf(usernameAutocompletionResults[0]))
         }
      }
   }, [usernameAutocompletionResults, highlightedItem])
   
   function autocompleteMention(user: string) {
      const arr = input.split(' ')
      arr[arr.length - 1] = '@' + user
      setInput(arr.join(' ') + ' ')
      chatRef.current.focus()
      setShowUserList(false)
      setUsernameAutocompletionText(null)
      setUsernameAutocompletionResults(null)
   }
   
   return (
      <>
         
         {showUserList && (
            <div className="chat-mention">
               <ul ref={setRef('ul') as RefObject<any>}>
                  {
                     (usernameAutocompletionResults &&
                        usernameAutocompletionResults?.length > 0) &&
                     usernameAutocompletionResults?.map(
                        (user: any, index) => {
                           return (
                              <li
                                 key={user}
                                 ref={setRef(index.toString()) as RefObject<any>}
                                 className={highlightedItem === index ? `selected` : ``}
                                 onClick={() => autocompleteMention(user)}
                              >
                                 {user}
                              </li>
                           )
                        })
                  }
               </ul>
            </div>
         )}
      
      </>
   )
   
}
