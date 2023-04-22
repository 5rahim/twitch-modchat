import React, { memo, useEffect, useRef, useState } from 'react'
import { Box, Button }                              from 'rebass'
import * as toxicity                                from "@tensorflow-models/toxicity"
import useInterval                                  from '../../../hooks/UseInterval'
import { useToggle }                                from '../../../hooks/UseToggle'
import { useTwitchApi }                             from '../../../hooks/UseAPI'
import { log }                                      from 'util'

require('@tensorflow/tfjs')

let verbs: string[], nouns: string[], adjectives: string[], adverbs: string[], preposition: string[]
nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"]
verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed", "fucked", "hated", "loathed"]
adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"]
adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"]
preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"]

function sentence() {
   let rand1 = Math.floor(Math.random() * 10)
   let rand2 = Math.floor(Math.random() * 10)
   let rand3 = Math.floor(Math.random() * 10)
   let rand4 = Math.floor(Math.random() * 10)
   let rand5 = Math.floor(Math.random() * 10)
   let rand6 = Math.floor(Math.random() * 10)
   return "The " + adjectives[rand1] +
      " " + nouns[rand2] +
      " " + adverbs[rand3] +
      " " + verbs[rand4] +
      " because some " + nouns[rand1] +
      " " + adverbs[rand1] + " "
      + verbs[rand1] + " " +
      preposition[rand1] + " a " +
      adjectives[rand2] + " " + nouns[rand5] +
      " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + "."
}

// function Toxicity({ predictions }: any) {
//    const style = { margin: 10 }
//
//    if (!predictions) return <div style={style}>Loading predictions...</div>
//
//    return (
//       <div style={style}>
//          {predictions.map(({ label, match, probability }: any) => (
//             <div style={{ margin: 5 }} key={label}>
//                {`${label} - ${probability} - ${match ? '🤢' : '🥰'}`}
//             </div>
//          ))}
//       </div>
//    )
// }


const Message = memo(({ message, model }: { message: string, model: any }) => {
   
   const [toxicity, setToxicity] = useState(null)
   const [match, setMatch] = useState<boolean | null>(null)
   
   useEffect(() => {
      const predict = async () => {
         let predictions: any = []
         if (!message) return
         
         const result = await model.classify([message]).catch(() => {})
         
         if (!result) return null
         
         result.map((prediction: any) => {
            const [{ match, probabilities }] = prediction.results
            predictions.push({
               label: prediction.label,
               match,
               probabilities,
               probability: (probabilities[1] * 100).toFixed(2) + "%",
            })
         })
         
         setToxicity(predictions?.filter((value: any) => value['label'] === 'insult')[0].probability)
         setMatch(predictions?.filter((p: any) => p['match'] === true).length > 0)
      }
      
      predict()
   }, [])
   
   return (
      <Box mb={1} backgroundColor={match ? '#ffffff' : 'transparent'} color={match ? '#f96060' : null}>{message} - {toxicity && toxicity}</Box>
   )
})

let id = 0
let count = 0

export const BodyguardTest = memo(() => {
   const [model, setModel] = useState<any>(null)
   const [messages, setMessages] = useState<{ value: string, id: number }[]>([])
   const [isOn, toggleIsOn] = useToggle(false)
   const chatContainerRef: any = useRef(null)
   const { chatClient } = useTwitchApi()
   // predictions are updated every time the value is updated
   // const predictions: any = useBodyguardTextToxicity(value, { threshold: .5 })
   
   useEffect(() => {
      const scroll = chatContainerRef?.current?.scrollHeight - chatContainerRef?.current?.clientHeight
      chatContainerRef?.current && chatContainerRef?.current?.scrollTo(0, scroll)
      
      if (messages.length > 10) {
         messages.shift()
         setMessages(messages)
      }
      
   }, [messages])
   
   useEffect(() => {
      const loadModel = async () => {
         //@ts-ignore
         setModel(await toxicity.load(0.5))
      }
      loadModel()
   }, [])
   
   useEffect(() => {
      // console.log(chatClient, model, isOn)
      if (chatClient && model && isOn) {
         chatClient.onMessage((channel: any, user: any, message: any) => {
            setMessages([...messages, { value: message, id: id++ }])
            console.log(message)
         })
      }
   }, [chatClient, model, isOn])
   
   // useInterval(() => {
   //    (model && isOn) && setMessages([...messages, { value: sentence(), id: id++ }])
   //    console.log('message sent', count++)
   // }, 200)
   //
   return (
      <>
         <div>
            <div>Write something</div>
            <div className="field">
               {/*<textarea*/}
               {/*   style={{ height: 100 }}*/}
               {/*   value={value}*/}
               {/*   onChange={(e) => setValue(e.target.value)}*/}
               {/*/>*/}
               <Button size={'small'} backgroundColor={'#b25bf1'} onClick={toggleIsOn}>Turn on/off</Button>
            </div>
         </div>
         {model &&
         <Box maxHeight={'400px'} overflowX={'auto'} ref={chatContainerRef}>
            {messages?.map((message) => {
               return <Message key={message.id} message={message.value} model={model} />
            })}
         </Box>}
         {/*{value && <Toxicity predictions={predictions} />}*/}
      </>
   )
})
