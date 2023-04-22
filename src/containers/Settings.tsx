import {
   BiBrush, BiCheckShield,
   BiChip, BiHighlight,
   BiListCheck, BiMessageError,
   BiUser, BiX,
}                                          from 'react-icons/all'
import AutoSizer                           from 'react-virtualized-auto-sizer'
import { Tab, TabList, TabPanel, Tabs }    from 'react-tabs'
import { Appearance }                      from '../components/Settings/Appearance'
import React, { memo }                     from 'react'
import { AutopilotActivation, Moderation } from '../components/Settings/Moderation'
import { AppActions, AppSelectors }        from '../store/slices/AppSlice'
import { useDispatch, useSelector }        from '../store'
import { NaturalTest }                     from '../components/Settings/tests/NaturalTest'
import { BodyguardTest }                   from '../components/Settings/tests/BodyguardTest'
import { Account }                         from '../components/Settings/Account'
import { Mentions }                        from '../components/Settings/Mentions'
import { Commands }                        from '../components/Settings/Commands'
import { Highlighting }                    from '../components/Settings/Highlighting'
import '../styles/Settings.scss'

export const Settings = memo(() => {
   
   const opened = useSelector(AppSelectors.showSettingsWindow)
   
   const dispatch = useDispatch()
   
   return (
      <div className={`settings-wrapper ${opened ? 'opened' : 'closed'}`}>
         <div className="settings">
            <div className="settings-close" onClick={() => dispatch(AppActions.closeSettingsWindow())}><BiX /></div>
            <div className="settings-content">
               <h2>Settings</h2>
               
               <AutopilotActivation />
               
               <AutoSizer>
                  {({ height, width }) => (
                     
                     <Tabs defaultIndex={0} style={{ height, width, paddingBottom: '70px' }}>
                        <div className="settings-sections">
                           <div className="settings-section-categories">
                              <TabList>
                                 <Tab><BiBrush /> Appearance</Tab>
                                 <Tab><BiCheckShield /> Moderation</Tab>
                                 <Tab><BiHighlight /> Highlighting</Tab>
                                 <Tab><BiListCheck /> Commands</Tab>
                                 <Tab><BiMessageError /> Mentions</Tab>
                                 <Tab><BiUser /> Account</Tab>
                                 <Tab><BiChip /> Bodyguard Test</Tab>
                                 <Tab><BiChip /> Natural Test</Tab>
                              </TabList>
                           </div>
                           <div className="settings-section-content">
                              <TabPanel>
                                 <Appearance />
                              </TabPanel>
                              
                              <TabPanel>
                                 <Moderation />
                              </TabPanel>
                              
                              <TabPanel>
                                 <Highlighting />
                              </TabPanel>
                              
                              <TabPanel>
                                 <Commands />
                              </TabPanel>
                              
                              <TabPanel>
                                 <Mentions />
                              </TabPanel>
                              
                              <TabPanel>
                                 <Account />
                              </TabPanel>
                              
                              <TabPanel>
                                 <BodyguardTest />
                              </TabPanel>
                              
                              <TabPanel>
                                 <NaturalTest />
                              </TabPanel>
                           </div>
                        </div>
                     </Tabs>
                  
                  )}
               </AutoSizer>
            
            </div>
         </div>
      </div>
   )
   
})
