import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { Cell }                         from './Cell'
import React, { memo }                  from 'react'
import { ItemCreationForm }                from './ItemCreationForm'
import { SettingsKeys, SettingsSelectors } from '../../store/slices/SettingsSlice'
import { useSelector }                     from '../../store'

export const Highlighting = memo(() => {
   
   const highlightedUsers = useSelector(SettingsSelectors.highlightedUsers)
   const highlightedMessages = useSelector(SettingsSelectors.highlightedMessages)
   
   return (
      <Tabs>
         <div className="settings-subsection">
            <h4>Highlights</h4>
            <div className="settings-subsection-categories">
               <TabList>
                  <Tab>Users</Tab>
                  <Tab>Messages</Tab>
               </TabList>
            </div>
            <div className="settings-subsection-content">
               
               {/*Users*/}
               <TabPanel>
                  
                  <ItemCreationForm setting={SettingsKeys.highlightedUsers} name={'name'} defaultValues={{ color: '#373434', flash: false, hide: false }} />
                  
                  {highlightedUsers?.map((data: any, index: number) => {
                     return <Cell setting={SettingsKeys.highlightedUsers} data={{ ...data, index }} key={data.name} />
                  })}
               
               </TabPanel>
               
               {/*Messages*/}
               <TabPanel>
                  
                  <ItemCreationForm setting={SettingsKeys.highlightedMessages} name={'pattern'} defaultValues={{ color: '#373434', flash: false, caseSensitive: false, regex: false, hide: false }} />
                  
                  {highlightedMessages?.map((data: any, index: number) => {
                     return <Cell setting={SettingsKeys.highlightedMessages} data={{ ...data, index }} key={data.pattern} />
                  })}
               </TabPanel>
            </div>
         </div>
      </Tabs>
   )
   
})
