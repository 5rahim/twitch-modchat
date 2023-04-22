import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useThrottle } from '../../hooks/UseThrottle'
import { MinimapNodeChild } from './MinimapNodeChild'
import _ from 'lodash'

interface ChatContainerProps {
   className?: string
   selector?: string
   width?: number
   height?: number
   keepAspectRatio?: boolean
   minimapNode?: any
   onMountCenterOnX?: boolean
   onMountCenterOnY?: boolean
   children: React.ReactNode
}


export const ChatContainer: React.FC<ChatContainerProps> = (
   {
      className = '',
      selector = '.chat-line-content',
      width: propWidth = 200,
      height: propHeight = 200,
      keepAspectRatio = false,
      minimapNode = MinimapNodeChild,
      onMountCenterOnX = false,
      onMountCenterOnY = false,
      children,
   }: ChatContainerProps) => {
   
   const [viewport, setViewport] = useState<any>()
   const [width, setWidth] = useState<number>(propWidth)
   const [height, setHeight] = useState<number>(propHeight)
   const [downState, setDownState] = useState<boolean>(false)
   const [initState, setInitState] = useState<boolean>(false)
   
   const [currentChildren, setCurrentChildren] = useState<React.ReactNode>([])
   const [y, setY] = useState<number>()
   const [x, setX] = useState<number>()
   const [w, setW] = useState<number>()
   const [h, setH] = useState<number>()
   const [l, setL] = useState<number>()
   const [t, setT] = useState<number>()
   
   const containerRef = useRef<HTMLDivElement>(null)
   const minimapRef = useRef<HTMLDivElement>(null)
   
   const resize = useThrottle(synchronize, 100)
   
   useEffect(() => {
      
      setTimeout(() => {
            synchronize({
               centerOnX: onMountCenterOnX,
               centerOnY: onMountCenterOnY,
            })
         }
      )
      window.addEventListener('resize', resize)
      init()
      
      if (initState) {
         setInitState(false)
      } else {
         setInitState(true)
         init()
      }
      
      return () => {
         window.removeEventListener('resize', resize)
      }
   }, [])
   
   useEffect(() => {
      setTimeout(() => {
         synchronize()
      })
   }, [keepAspectRatio, children])
   
   useEffect(() => {
      // console.log('new child')
      init()
   }, [children])
   
   useEffect(() => {
      // console.log(currentChildren)
   }, [currentChildren])
   
   
   function init() {
      
      const MinimapNode = minimapNode
      
      if (containerRef.current) {
         
         const { scrollWidth, scrollHeight, scrollTop, scrollLeft } = containerRef.current
         const sourceRect = containerRef.current.getBoundingClientRect()
         
         let ratioX = width / scrollWidth
         let ratioY = height / scrollHeight
         
         if (keepAspectRatio) {
            if (ratioX < ratioY) {
               ratioY = ratioX
               setHeight(Math.round(scrollHeight / (scrollWidth / width)))
            } else {
               ratioX = ratioY
               setWidth(Math.round(scrollWidth / (scrollHeight / height)))
            }
         }
         
         const nodes = containerRef.current.querySelectorAll(selector)
   
         setCurrentChildren(_.map(nodes, (node, key) => {
               const { width, height, left, top } = node.getBoundingClientRect()
      
               const wM = width * ratioX
               const hM = height * ratioY
               const xM = (left + scrollLeft - sourceRect.left) * ratioX
               const yM = (top + scrollTop - sourceRect.top) * ratioY
      
               return (
                  <MinimapNode
                     key={key}
                     width={Math.round(wM)}
                     height={Math.round(hM)}
                     left={Math.round(xM)}
                     top={Math.round(yM)}
                     node={node}
                  />
               )
            }
         ))
         
      }
      
   }
   
   function synchronize(options?: any) {
   
      console.log('synchro')
      
      const { current } = containerRef
      
      if (current) {
         const rect = current.getBoundingClientRect()
         
         const dims = [rect.width, rect.height]
         const scroll = [current.scrollLeft, current.scrollTop]
         const scaleX = width / current.scrollWidth
         const scaleY = height / current.scrollHeight
         
         const lW = dims[0] * scaleX
         const lH = dims[1] * scaleY
         const lX = scroll[0] * scaleX
         const lY = scroll[1] * scaleY
         
         // Ternary operation includes sanity check
         setW(Math.round(lW) > width ? width : Math.round(lW))
         setH(Math.round(lH) > height ? height : Math.round(lH))
         setL(Math.round(lX))
         setT(Math.round(lY))
         
         if (options !== undefined) {
            if (options.centerOnX === true) {
               current.scrollLeft = current.scrollWidth / 2 - dims[0] / 2
            }
            
            if (options.centerOnY === true) {
               current.scrollTop = current.scrollHeight / 2 - dims[1] / 2
            }
         }
         
         redraw()
      }
      
   }
   
   function handleDown(e: React.MouseEvent | React.TouchEvent) {
      if (minimapRef.current && l && w && t && h) {
         const pos = minimapRef.current.getBoundingClientRect()
         
         setH(Math.round(pos.left + l + w / 2))
         setY(Math.round(pos.top + t + h / 2))
         
         setDownState(true)
         handleMove(e)
      }
   }
   
   function handleMove(e: React.TouchEvent | React.MouseEvent) {
      if (containerRef.current && x && y && l && t && w && h) {
         
         if (!downState) return
         
         let event
         
         e.preventDefault()
         
         if (e.type.match(/touch/)) {
            
            if ((e as React.TouchEvent).touches.length > 1) {
               return
            }
            event = (e as React.TouchEvent).touches[0]
         } else {
            event = e as React.MouseEvent
         }
         
         let dx = (event as React.MouseEvent).nativeEvent.clientX - x
         let dy = (event as React.MouseEvent).nativeEvent.clientY - y
         if (l + dx < 0) {
            dx = -l
         }
         if (t + dy < 0) {
            dy = -t
         }
         if (l + w + dx > width) {
            dx = width - l - w
         }
         if (t + h + dy > height) {
            dy = height - t - h
         }
         
         // x += dx
         setX(x => x ? x + dx : x)
         // y += dy
         setY(y => y ? y + dy : y)
         
         // l += dx
         setL(l => l && !(l + dx < 0) ? l + dx : l)
         // t += dy
         setT(t => t && !(t + dy < 0) ? t + dy : t)
         
         
         const coefX = width / containerRef.current.scrollWidth
         const coefY = height / containerRef.current.scrollHeight
         const left = l / coefX
         const top = t / coefY
         
         containerRef.current.scrollLeft = Math.round(left)
         containerRef.current.scrollTop = Math.round(top)
         redraw()
         
      }
   }
   
   function handleUp() {
      setDownState(false)
   }
   
   function redraw() {
      setViewport(<div
         className="minimap-viewport"
         style={{
            width: `${w}px`,
            height: `${h}px`,
            left: `${l}px`,
            top: `${t}px`,
         }}
      />)
   }
   
   
   return (
      <>
         <div className={'minimap-container ' + className}>
            <div
               className="minimap"
               style={{
                  width: `${width}px`,
                  height: `${height}px`,
               }}
               ref={minimapRef}
               onMouseDown={handleDown}
               onTouchStart={handleDown}
               onTouchMove={handleMove}
               onMouseMove={handleMove}
               onTouchEnd={handleUp}
               onMouseUp={handleUp}
            >
               {viewport}
               {currentChildren}
            </div>
            
            <div
               className={'minimap-container-scroll'}
               onScroll={synchronize}
               ref={containerRef}
            >
               {children}
            </div>
         </div>
      </>
   )
   
   
}
