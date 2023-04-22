import { Switch } from '../Switch'
import React, { memo } from 'react'
import { SettingLine } from './SettingLine'
import Editable from '../Editable'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { BiMeteor, BiShieldQuarter } from 'react-icons/all'
import { Cell } from './Cell'
import { ItemCreationForm } from './ItemCreationForm'
import { SettingsActions, SettingsKeys, SettingsSelectors } from '../../store/slices/SettingsSlice'
import { useDispatch, useSelector } from '../../store'
import '../../styles/Form.scss'

export const Moderation = memo(() => {
   
   const bodyguardIsOn = useSelector(SettingsSelectors.bodyguardIsOn)
   const quickMode = useSelector(SettingsSelectors.quickMode)
   const games = useSelector(SettingsSelectors.games)
   const nukes = useSelector(SettingsSelectors.nukes)
   const timeouts = useSelector(SettingsSelectors.timeouts)
   const autopilotIsOn = useSelector(SettingsSelectors.autopilotIsOn)
   const autopilotIsRegex = useSelector(SettingsSelectors.autopilotIsRegex)
   const autopilotIsCaseSensitive = useSelector(SettingsSelectors.autopilotIsCaseSensitive)
   const autopilotTimeout = useSelector(SettingsSelectors.autopilotTimeout)
   const autopilotPatterns = useSelector(SettingsSelectors.autopilotPatterns)
   
   const dispatch = useDispatch()
   
   return (
      <>
         <Tabs defaultIndex={0}>
            <div className="settings-subsection">
               <h4>Moderation</h4>
               <div className="settings-subsection-categories">
                  <TabList>
                     <Tab>Options</Tab>
                     <Tab><BiMeteor /> Nukes</Tab>
                     <Tab><BiShieldQuarter />Autopilot</Tab>
                  </TabList>
               </div>
               <div className="settings-subsection-content">
                  
                  {/*Options*/}
                  <TabPanel>
                     <div style={{ color: '#3296db' }}>
                        <SettingLine>
                           <Switch
                              checked={bodyguardIsOn}
                              text={'Turn on Bodyguard'}
                              onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.bodyguardIsOn, bodyguardIsOn))} />
                           <div>
                              <i style={{ opacity: '.5', color: '#fff' }}>Detects and highlights toxic messages</i>
                           </div>
                        </SettingLine>
                     </div>
                     <SettingLine>
                        <Switch
                           checked={quickMode}
                           text={'Advanced mode'}
                           onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.quickMode, quickMode))} />
                        <div>
                           <i style={{ opacity: '.5' }}>Displays Mod Icons and Timeout Bar when you click on a message</i>
                        </div>
                     </SettingLine>
                     
                     <div className="divider" />
                     
                     <h4>Games</h4>
                     <SettingLine>
                        <ItemCreationForm setting={SettingsKeys.games} name={'game'} />
                        
                        {games?.map((game: string, index: number) => {
                           return <Cell setting={SettingsKeys.games} data={{ game, index }} key={index} />
                        })}
                     </SettingLine>
                     
                     <h4>Timeouts</h4>
                     <SettingLine>
                        <ItemCreationForm setting={SettingsKeys.timeouts} name={'timeout'} />
                        
                        {timeouts?.map((timeout: string, index: number) => {
                           return <Cell setting={SettingsKeys.timeouts} data={{ timeout, index }} key={timeout} />
                        })}
                     </SettingLine>
                  
                  </TabPanel>
                  
                  {/*Nukes*/}
                  <TabPanel>
                     <SettingLine>
                        <ItemCreationForm setting={SettingsKeys.nukes} name={'pattern'} defaultValues={{ radiation: true, radiationLength: '5m', duration: '1m', reach: '1m' }} />
                        
                        {nukes?.map((nuke: any, index: number) => {
                           return <Cell setting={SettingsKeys.nukes} data={{ ...nuke, index }} key={nuke.pattern} />
                        })}
                     </SettingLine>
                  </TabPanel>
                  
                  {/*Autopilot*/}
                  <TabPanel>
                     <i style={{ marginBottom: '1rem', display: 'block' }}>
                        Autopilot automatically looks out for specified patterns in users' messages
                        and time them out after a short delay.
                        Don't leave it enabled for a long period of time.
                     </i>
                     <SettingLine>
                        <span style={{ color: '#e14f4f' }}>
                           <b>
                              <Switch
                                 checked={autopilotIsOn}
                                 text={'Enable Autopilot'}
                                 onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.autopilotIsOn, autopilotIsOn))}
                              />
                           </b>
                        </span>
                     </SettingLine>
                     
                     <div className="divider" />
                     
                     <SettingLine>
                        <div className="field">
                           <label htmlFor="timeout" style={{ marginBottom: '.6rem', display: 'flex' }}>Timeout</label>
                           {autopilotTimeout &&
                           <Editable
                               onValueChange={(value) =>
                                  dispatch(SettingsActions.update(SettingsKeys.autopilotTimeout, value.match(/\b^\d+m\b/) ? value : '1m'))}
                               value={autopilotTimeout}
                               indication
                               fullWidth
                           />}
                        </div>
                     </SettingLine>
                     
                     <div className="divider" />
                     
                     <h4>Patterns</h4>
                     
                     <SettingLine>
                        
                        <SettingLine>
                        <span>
                              <Switch
                                 checked={autopilotIsCaseSensitive}
                                 text={'Case sensitive'}
                                 onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.autopilotIsCaseSensitive, autopilotIsCaseSensitive))}
                              />
                        </span>
                        </SettingLine>
                        <SettingLine>
                        <span>
                              <Switch
                                 checked={autopilotIsRegex}
                                 text={'Is Regex'}
                                 onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.autopilotIsRegex, autopilotIsRegex))}
                              />
                        </span>
                        </SettingLine>
                        
                        <ItemCreationForm
                           name={'pattern'}
                           setting={SettingsKeys.autopilotPatterns}
                        />
                        
                        <div className="field">
                           {autopilotPatterns?.map((pattern: string, index: number) => {
                              return <Cell setting={SettingsKeys.autopilotPatterns} data={{ pattern, index }} key={pattern} />
                           })}
                        </div>
                     </SettingLine>
                  
                  </TabPanel>
               
               </div>
            </div>
         </Tabs>
      
      </>
   )
   
})

export const AutopilotActivation = memo(() => {
   
   const autopilotIsOn = useSelector(SettingsSelectors.autopilotIsOn)
   const dispatch = useDispatch()
   
   return (
      <div style={{ display: autopilotIsOn ? 'block' : 'none' }}>
         <div style={{ position: 'absolute', right: '3rem', top: '1rem', backgroundColor: '#c43a3a', padding: '.3rem .5rem', borderRadius: '.3rem', cursor: 'pointer' }}>
            <div onClick={() => dispatch(SettingsActions.update(SettingsKeys.autopilotIsOn, false))}>
               Turn off autopilot
            </div>
         </div>
      </div>
   )
   
})
