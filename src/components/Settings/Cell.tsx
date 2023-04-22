import React, { memo, useCallback, useEffect, useState } from 'react'
import {
   BiAtom, BiBell, BiBellOff,
   BiChevronDown, BiFontSize, BiHealth,
   BiHide, BiShow, BiTrash,
}                                                        from 'react-icons/all'
import classNames                                        from 'classnames'
import { GithubPicker }                                  from "react-color"
import Editable                                          from '../Editable'
import { colors }                                        from './Colors'
import { Box, Flex }                                     from 'rebass'
import { CopyButton }                                    from '../CopyButton'
import { useToggle }                                     from '../../hooks/UseToggle'
import { useDispatch }                                   from '../../store'
import { SettingsActions }                               from '../../store/slices/SettingsSlice'

interface CellProps {
   setting: 'highlighting.users' | 'highlighting.messages' | 'moderation.autopilot.patterns' | 'moderation.games' | 'moderation.timeouts' |
      'moderation.nukes' | 'commands' | string
   data: any
}

export const Cell: React.FC<CellProps> = memo((props: CellProps) => {
   const { setting, data } = props
   
   const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)
   
   const [isEditing, toggleEditing, setIsEditing] = useToggle(false)
   const [isDeleting, toggleDeleting, setIsDeleting] = useToggle(false)
   
   useEffect(() => setIsDeleting(false), [isEditing])
   
   const dispatch = useDispatch()
   
   const handleChangeColor = useCallback((color) => {
      dispatch(SettingsActions.updateItem(setting, 'color', data.index, color.hex))
      setDisplayColorPicker(false)
   }, [])
   
   function content() {
      switch (setting) {
         
         case 'highlighting.users':
            
            return (
               <>
                  <div className="setting-cell-meta" onClick={() => setIsEditing(false)}>
                     <div className="setting-cell-name">
                        <Editable value={data.name} onValueChange={(value) => dispatch(SettingsActions.updateItem(setting, 'name', data.index, value))} />
                     </div>
                  </div>
                  <div className="setting-cell-status">
                     <ul>
                        <li className={'setting-cell-trash'} onClick={() => toggleEditing()}>
                           <BiTrash />
                        </li>
                        <li onClick={() => setDisplayColorPicker(!displayColorPicker)} className='setting-cell-color' style={{ backgroundColor: data.color }} />
                        {displayColorPicker && (
                           <div className='setting-cell-color-picker'>
                              <GithubPicker
                                 width={'187px'}
                                 triangle='top-right'
                                 colors={colors}
                                 color={data.color}
                                 onChange={handleChangeColor}
                              />
                           </div>
                        )}
                        <li onClick={() => dispatch(SettingsActions.updateItem(setting, 'flash', data.index, !data.flash))} className={classNames({ active: data.flash })}>
                           {data.flash ? <BiBell /> : <BiBellOff />}
                        </li>
                        <li onClick={() => dispatch(SettingsActions.updateItem(setting, 'hide', data.index, !data.hide))} className={classNames({ active: !data.hide })}>
                           {!data.hide ? <BiShow /> : <BiHide />}
                        </li>
                     </ul>
                  </div>
                  {isEditing && <div className="setting-cell-action">
                      <button className={'button button-danger button-small'} onClick={() => dispatch(SettingsActions.removeItem(setting, data.index))}>Delete</button>
                  </div>}
               </>
            )
         
         case 'highlighting.messages':
            
            return (
               <>
                  <div className="setting-cell-meta" onClick={() => setIsEditing(false)}>
                     <div className="setting-cell-name">
                        <Editable size={18} value={data.pattern} onValueChange={(value) => dispatch(SettingsActions.updateItem(setting, 'pattern', data.index, value))} />
                     </div>
                  </div>
                  <div className="setting-cell-status">
                     <ul>
                        <div className={'setting-cell-edit'}>
                           
                           <li className={'setting-cell-trash'} onClick={() => toggleEditing()}>
                              <BiTrash />
                           </li>
                           <li onClick={() => dispatch(SettingsActions.updateItem(setting, 'caseSensitive', data.index, !data.caseSensitive))} className={classNames({ active: data.caseSensitive })}>
                              {<BiFontSize />}
                           </li>
                        
                        </div>
                        <li onClick={() => setDisplayColorPicker(!displayColorPicker)} className='setting-cell-color' style={{ backgroundColor: data.color }} />
                        {displayColorPicker && (
                           <div className='setting-cell-color-picker' style={{ marginRight: '1.6rem' }}>
                              <GithubPicker
                                 width={'187px'}
                                 triangle='top-right'
                                 colors={colors}
                                 color={data.color}
                                 onChange={handleChangeColor}
                              />
                           </div>
                        )}
                        <li onClick={() => dispatch(SettingsActions.updateItem(setting, 'regex', data.index, !data.regex))} className={classNames({ active: data.regex })}>
                           {<BiHealth />}
                        </li>
                        <li onClick={() => dispatch(SettingsActions.updateItem(setting, 'flash', data.index, !data.flash))} className={classNames({ active: data.flash })}>
                           {data.flash ? <BiBell /> : <BiBellOff />}
                        </li>
                        <li onClick={() => dispatch(SettingsActions.updateItem(setting, 'hide', data.index, !data.hide))} className={classNames({ active: !data.hide })}>
                           {!data.hide ? <BiShow /> : <BiHide />}
                        </li>
                     </ul>
                  </div>
                  {isEditing && <div className="setting-cell-action">
                      <button className={'button button-danger button-small'} onClick={() => dispatch(SettingsActions.removeItem(setting, data.index))}>Delete</button>
                  </div>}
               </>
            )
         
         case 'moderation.autopilot.patterns':
            
            return (
               <>
                  <div className="setting-cell-meta" onClick={() => setIsEditing(false)}>
                     <div className="setting-cell-name">
                        <Editable size={18} value={data.pattern} onValueChange={(value) => dispatch(SettingsActions.updateArrayItem(setting, data.index, value))} />
                     </div>
                  </div>
                  <div className="setting-cell-status">
                     <ul>
                        <li style={{ marginLeft: '.3rem' }} onClick={() => toggleEditing()}>
                           <BiTrash />
                        </li>
                     </ul>
                  </div>
                  {isEditing && <div className="setting-cell-action">
                      <button className={'button button-danger button-small'} onClick={() => dispatch(SettingsActions.removeItem(setting, data.index))}>Delete</button>
                  </div>}
               </>
            )
         
         case 'moderation.games':
            
            return (
               <>
                  <div className="setting-cell-meta" onClick={() => setIsEditing(false)}>
                     <div className="setting-cell-name">
                        <Editable size={18} value={data.game} onValueChange={(value) => dispatch(SettingsActions.updateArrayItem(setting, data.index, value))} />
                     </div>
                  </div>
                  <div className="setting-cell-status">
                     <ul>
                        <li style={{ marginLeft: '.3rem' }} onClick={() => toggleEditing()}>
                           <BiTrash />
                        </li>
                     </ul>
                  </div>
                  {isEditing && <div className="setting-cell-action">
                      <button className={'button button-danger button-small'} onClick={() => dispatch(SettingsActions.removeItem(setting, data.index))}>Delete</button>
                  </div>}
               </>
            )
         
         case 'moderation.timeouts':
            
            return (
               <>
                  <div className="setting-cell-meta" onClick={() => setIsEditing(false)}>
                     <div className="setting-cell-name">
                        <Editable size={1} value={data.timeout} onValueChange={(value) => dispatch(SettingsActions.updateArrayItem(setting, data.index, value))} />
                     </div>
                  </div>
                  <div className="setting-cell-status">
                     <ul>
                        <li style={{ marginLeft: '.3rem' }} onClick={() => toggleEditing()}>
                           <BiTrash />
                        </li>
                     </ul>
                  </div>
                  {isEditing && <div className="setting-cell-action">
                      <button className={'button button-danger button-small'} onClick={() => dispatch(SettingsActions.removeItem(setting, data.index))}>Delete</button>
                  </div>}
               </>
            )
         
         case 'moderation.nukes':
            
            return (
               <>
                  <div className="setting-cell-meta" onClick={() => setIsEditing(false)}>
                     <div className="setting-cell-name">
                        <Editable size={9} value={data.pattern} onValueChange={(value) => dispatch(SettingsActions.updateItem(setting, 'pattern', data.index, value))} />
                     </div>
                  </div>
                  <div className="setting-cell-status">
                     <ul>
                        <li onClick={() => dispatch(SettingsActions.updateItem(setting, 'radiation', data.index, !data.radiation))} className={classNames({ active: data.radiation })}>
                           <BiAtom />
                        </li>
                        <li style={{ marginLeft: '.3rem' }} onClick={() => toggleEditing()}>
                           <BiChevronDown />
                        </li>
                     </ul>
                  </div>
                  <div className="setting-cell-nuke-details">
                     <ul>
                        {
                           data.radiation &&
                           <li>-r=<Editable size={1} value={data.radiationLength} onValueChange={(value) => dispatch(SettingsActions.updateItem(setting, 'radiationLength', data.index, value))} />
                           </li>
                        }
                        <li>
                           <Editable size={1} value={data.reach} onValueChange={(value) => dispatch(SettingsActions.updateItem(setting, 'reach', data.index, value))} />
                        </li>
                        <li>
                           <Editable size={1} value={data.duration} onValueChange={(value) => dispatch(SettingsActions.updateItem(setting, 'duration', data.index, value))} />
                        </li>
                     </ul>
                  
                  </div>
                  {isEditing && <div className="setting-cell-action">
                      <Box mb={3} opacity={.5}>
                          <i style={{ marginRight: '.5rem' }}>
                              !nuke&nbsp;
                              <Editable
                                  size={20}
                                  value={data.pattern}
                                  onValueChange={(value) => dispatch(SettingsActions.updateItem(setting, 'pattern', data.index, value))}
                              /> {data.radiation ? `-r=${data.radiationLength}` : ''} {data.reach} {data.duration}
                          </i>
                          <CopyButton text={`!nuke ${data.pattern} ${data.radiation ? `-r=${data.radiationLength}` : ''} ${data.reach} ${data.duration}`} />
                      </Box>
                      <button className={'button button-danger button-small'} onClick={() => dispatch(SettingsActions.removeItem(setting, data.index))}>Delete</button>
                  </div>}
               </>
            )
         
         case 'commands':
            
            return (
               <>
                  <div className="setting-cell-meta" onClick={() => setIsEditing(false)}>
                     <div className="setting-cell-name">
                        /<Editable size={18} value={data.name} onValueChange={(value) => dispatch(SettingsActions.updateItem(setting, 'name', data.index, value))} />
                     </div>
                  </div>
                  <div className="setting-cell-status">
                     <ul>
                        <li style={{ marginLeft: '.3rem' }} onClick={() => toggleEditing()}>
                           <BiChevronDown />
                        </li>
                     </ul>
                  </div>
                  {isEditing && <div className="setting-cell-action">
                      <Box mb={3}>
                          <Editable
                              type={'textarea'}
                              onValueChange={(value) => dispatch(SettingsActions.updateItem(setting, 'func', data.index, value))}
                              value={data.func}
                              indication
                              fullWidth
                          />
                      </Box>
                      <Box>
                          <Flex width={'100%'} justifyContent={'flex-end'}>
                              <Box mr={3} display={isDeleting ? 'block' : 'none'}><a onClick={() => dispatch(SettingsActions.removeItem(setting, data.index))}>Are
                                  you sure?</a></Box>
                              <button className={'button button-danger button-small'} onClick={toggleDeleting}>Delete</button>
                          </Flex>
                      </Box>

                  </div>}
               </>
            )
         
         default:
            return ``
      }
   }
   
   return (
      <div className={'setting-cell'}>
         {content()}
      </div>
   )
})
