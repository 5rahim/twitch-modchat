import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import { MinimapNodeChild } from './MinimapNodeChild'

export class Minimap extends React.Component {
   static propTypes = {
      className: PropTypes.string,
      selector: PropTypes.string.isRequired,
      width: PropTypes.number /** in pixel */,
      height: PropTypes.number /** in pixel */,
      keepAspectRatio: PropTypes.bool,
      childComponent: PropTypes.any,
      onMountCenterOnX: PropTypes.bool,
      onMountCenterOnY: PropTypes.bool,
   }

   static defaultProps = {
      className: '',
      width: 200,
      height: 200,
      keepAspectRatio: false,
      childComponent: MinimapNodeChild,
      onMountCenterOnX: false,
      onMountCenterOnY: false,
   }

   constructor(props: any) {
      super(props)
      this.down = this.down.bind(this)
      this.move = this.move.bind(this)
      this.synchronize = this.synchronize.bind(this)
      this.init = this.init.bind(this)
      this.up = this.up.bind(this)

      // @ts-ignore
      this.resize = _.throttle(this.synchronize, 100)

      this.state = {
         children: null,
         viewport: null,
         width: props.width,
         height: props.height,
      }

      // @ts-ignore
      this.downState = false
      // @ts-ignore
      this.initState = false
   }

   componentDidMount() {
      // @ts-ignore
      const { onMountCenterOnX, onMountCenterOnY } = this.props
      setTimeout(() =>
         this.synchronize({
            centerOnX: onMountCenterOnX,
            centerOnY: onMountCenterOnY,
         }),
      )
      // @ts-ignore
      window.addEventListener('resize', this.resize)
      this.init()
   }

   componentWillUnmount() {
      // @ts-ignore
      window.removeEventListener('resize', this.resize)
   }

   // @ts-ignore
   componentWillReceiveProps(nextProps) {
      // @ts-ignore
      if (nextProps.keepAspectRatio !== this.props.keepAspectRatio) {
         setTimeout(this.synchronize)
      } else if (nextProps.children !== this.props.children) {
         setTimeout(this.synchronize)
      }
   }

   componentDidUpdate() {
      // @ts-ignore
      if (this.initState) {
         // @ts-ignore
         this.initState = false
      } else {
         // @ts-ignore
         this.initState = true
         this.init()
      }
   }

   init() {
      // @ts-ignore
      const { childComponent, keepAspectRatio } = this.props
      const ChildComponent = childComponent
      // @ts-ignore
      const { scrollWidth, scrollHeight, scrollTop, scrollLeft } = this.source
      // @ts-ignore
      const sourceRect = this.source.getBoundingClientRect()

      // @ts-ignore
      let { width, height } = this.props

      let ratioX = width / scrollWidth
      let ratioY = height / scrollHeight

      if (keepAspectRatio) {
         if (ratioX < ratioY) {
            ratioY = ratioX
            height = Math.round(scrollHeight / (scrollWidth / width))
         } else {
            ratioX = ratioY
            width = Math.round(scrollWidth / (scrollHeight / height))
         }
      }

      // @ts-ignore
      const nodes = this.source.querySelectorAll(this.props.selector)
      this.setState({
         ...this.state,
         height,
         width,
         children: _.map(nodes, (node, key) => {
            const { width, height, left, top } = node.getBoundingClientRect()

            const wM = width * ratioX
            const hM = height * ratioY
            const xM = (left + scrollLeft - sourceRect.left) * ratioX
            const yM = (top + scrollTop - sourceRect.top) * ratioY

            return (
               <ChildComponent
                  key={key}
                  width={Math.round(wM)}
                  height={Math.round(hM)}
                  left={Math.round(xM)}
                  top={Math.round(yM)}
                  node={node}
               />
            )
         }),
      })
   }

   down(e: any) {
      // @ts-ignore
      const pos = this.minimap.getBoundingClientRect()

      // @ts-ignore
      this.x = Math.round(pos.left + this.l + this.w / 2)
      // @ts-ignore
      this.y = Math.round(pos.top + this.t + this.h / 2)

      // @ts-ignore
      this.downState = true
      this.move(e)
   }

   up() {
      // @ts-ignore
      this.downState = false
   }

   move(e: any) {
      // @ts-ignore
      if (this.downState === false) return

      // @ts-ignore
      const { width, height } = this.state
      let event

      e.preventDefault()
      if (e.type.match(/touch/)) {
         if (e.touches.length > 1) {
            return
         }
         event = e.touches[0]
      } else {
         event = e
      }

      // @ts-ignore
      let dx = event.clientX - this.x
      // @ts-ignore
      let dy = event.clientY - this.y
      // @ts-ignore
      if (this.l + dx < 0) {
         // @ts-ignore
         dx = -this.l
      }
      // @ts-ignore
      if (this.t + dy < 0) {
         // @ts-ignore
         dy = -this.t
      }
      // @ts-ignore
      if (this.l + this.w + dx > width) {
         // @ts-ignore
         dx = width - this.l - this.w
      }
      // @ts-ignore
      if (this.t + this.h + dy > height) {
         // @ts-ignore
         dy = height - this.t - this.h
      }

      // @ts-ignore
      this.x += dx
      // @ts-ignore
      this.y += dy

      // @ts-ignore
      this.l += dx
      // @ts-ignore
      this.t += dy

      // Sanity checks:
      // @ts-ignore
      this.l = this.l < 0 ? 0 : this.l
      // @ts-ignore
      this.t = this.t < 0 ? 0 : this.t

      // @ts-ignore
      const coefX = width / this.source.scrollWidth
      // @ts-ignore
      const coefY = height / this.source.scrollHeight
      // @ts-ignore
      const left = this.l / coefX
      // @ts-ignore
      const top = this.t / coefY

      // @ts-ignore
      this.source.scrollLeft = Math.round(left)
      // @ts-ignore
      this.source.scrollTop = Math.round(top)
      this.redraw()
   }

   synchronize(options: any) {
      // @ts-ignore
      const { width, height } = this.state

      // @ts-ignore
      const rect = this.source.getBoundingClientRect()

      const dims = [rect.width, rect.height]
      // @ts-ignore
      const scroll = [this.source.scrollLeft, this.source.scrollTop]
      // @ts-ignore
      const scaleX = width / this.source.scrollWidth
      // @ts-ignore
      const scaleY = height / this.source.scrollHeight

      const lW = dims[0] * scaleX
      const lH = dims[1] * scaleY
      const lX = scroll[0] * scaleX
      const lY = scroll[1] * scaleY

      // Ternary operation includes sanity check
      // @ts-ignore
      this.w = Math.round(lW) > this.state.width
      // @ts-ignore
         ? this.state.width
         : Math.round(lW)
      // @ts-ignore
      this.h = Math.round(lH) > this.state.height
      // @ts-ignore
         ? this.state.height
         : Math.round(lH)
      // @ts-ignore
      this.l = Math.round(lX)
      // @ts-ignore
      this.t = Math.round(lY)

      if (options !== undefined) {
         if (options.centerOnX === true) {
            // @ts-ignore
            this.source.scrollLeft = this.source.scrollWidth / 2 - dims[0] / 2
         }

         if (options.centerOnY === true) {
            // @ts-ignore
            this.source.scrollTop = this.source.scrollHeight / 2 - dims[1] / 2
         }
      }

      this.redraw()
   }

   redraw() {
      this.setState({
         ...this.state,
         viewport: (
            <div
               className="minimap-viewport"
               style={{
      // @ts-ignore
                  width: this.w,
      // @ts-ignore
                  height: this.h,
      // @ts-ignore
                  left: this.l,
      // @ts-ignore
                  top: this.t,
               }}
            />
         ),
      })
   }

   render() {
      // @ts-ignore
      const { width, height } = this.state

      return (
      // @ts-ignore
         <div className={'minimap-container ' + this.props.className}>
            <div
               className="minimap"
               style={{
                  width: `${width}px`,
                  height: `${height}px`,
               }}
               ref={minimap => {
      // @ts-ignore
                  this.minimap = minimap
               }}
               onMouseDown={this.down}
               onTouchStart={this.down}
               onTouchMove={this.move}
               onMouseMove={this.move}
               onTouchEnd={this.up}
               onMouseUp={this.up}
            >
               {(this.state as any).viewport as any}
               {(this.state as any).children as any}
            </div>

            <div
               className={'minimap-container-scroll'}
               onScroll={this.synchronize}
               ref={container => {
      // @ts-ignore
                  this.source = container
               }}
            >
               <div style={{ display: 'none' }}>{this.props.children}</div>
            </div>
         </div>
      )
   }
}

export default Minimap
