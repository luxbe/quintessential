import { useRef, useEffect } from 'react'
import { Handler, useDrag } from '@use-gesture/react'
import { useSprings } from 'react-spring'
import { GameState } from '../types'
import { springConfig, zero } from '../constants'
import * as utils from './index'

const useGestures = ({
  state,
  onSelect,
  onSwap,
}: {
  state: GameState
  onSelect: (n: number | null) => void
  onSwap: (i1: number, i2: number) => void
}) => {
  const [springs, springAPI] = useSprings(25, () => springConfig)
  const targetRef = useRef<HTMLElement | null>(null)
  const clickedRef = useRef<HTMLElement | null>(null)
  const isAnimatingRef = useRef<boolean>(false)
  const isTargetAnimatingRef = useRef<boolean>(false)

  // reset tile colors on state change
  // handle case where target needs to stay highlighted while dragging
  useEffect(() => {
    const targetIndex = +(targetRef.current?.dataset?.index ?? '-1')
    springAPI.start((i) => ({
      backgroundColor:
        i === targetIndex ? '#999' : utils.getTileStateByIndex(state, i).color,
    }))
  }, [state, springAPI])

  const onTap = (tappedEl: HTMLElement) => {
    if (!tappedEl) return

    const index = +(tappedEl.dataset.index ?? '-1')
    const activeIndex = state.activeIndex

    // if no tile is selected, select the clicked tile
    if (typeof activeIndex !== 'number') {
      clickedRef.current = tappedEl
      return onSelect(index)
    }

    // if we click the selected tile, deselect it
    if (activeIndex === index) {
      return onSelect(null)
    }

    // otherwise, swap the active tile with the one we just clicked
    const a = utils.getTileElementData(tappedEl)
    const b = utils.getTileElementData(clickedRef.current)
    isAnimatingRef.current = true
    onSwap(activeIndex, index)
    tappedEl.classList.remove('drag')
    const onRest = () => {
      clickedRef.current = null
      isAnimatingRef.current = false
      springAPI.set(zero)
    }

    // animate swaps
    return springAPI.start((i) => {
      if (i === activeIndex) {
        return {
          from: { x: a.x - b.x, y: a.y - b.y, backgroundColor: a.color },
          to: zero,
        }
      } else if (i === index) {
        return {
          from: { x: b.x - a.x, y: b.y - a.y, backgroundColor: b.color },
          to: zero,
          onRest,
        }
      } else {
        return zero
      }
    })
  }

  const getBG = (i: number) => utils.getTileStateByIndex(state, i).color

  const onDrag: Handler<'drag'> = (opts) => {
    const { args, first, event, velocity, active, movement, tap } = opts
    const [draggedIndex] = args
    if (isAnimatingRef.current || state.isComplete) return

    const source = event.target as HTMLElement
    if (!source) return

    if (!source.className.includes('tile')) return

    if (tap) return onTap(source)

    if (first) source.classList.add('drag')
    const a = utils.getTileElementData(source)
    let b = utils.getTileElementData(targetRef.current)
    const [mX, mY] = movement
    const { pageX, pageY } = event as PointerEvent

    const onRest = () => {
      isAnimatingRef.current = false
      isTargetAnimatingRef.current = false
    }

    // actively dragging
    if (active) {
      const speed = Math.abs(velocity[0]) + Math.abs(velocity[1])
      // if close to source original position, preview cancel
      if (speed < 0.1) {
        const target = utils.getTileElementAtXY(pageX, pageY, source)
        if (Math.abs(mX) < 40 && Math.abs(mY) < 40 && targetRef.current) {
          isTargetAnimatingRef.current = true
          targetRef.current = null
          // if we've got a new target, switch if we aren't currently animating a switch
        } else if (target && b.index !== +(target.dataset.index ?? '-1')) {
          isTargetAnimatingRef.current = true
          targetRef.current = target
          b = utils.getTileElementData(target)
        }
      }

      return springAPI.start((i) => {
        if (i === b.index && targetRef.current) {
          // if it is the current swap target, move it so it appears in the source tiles position
          return { x: a.x - b.x, y: a.y - b.y, onRest, backgroundColor: '#999' }
        } else if (i === draggedIndex) {
          // if it is the source tile, move it to the pointer immediately
          const immediate = (k: string) => k === 'x' || k === 'y'
          return { x: mX, y: mY, backgroundColor: '#999', immediate }
        } else {
          // otherwise leave it in it's initial position
          return { ...zero, onRest, backgroundColor: getBG(i) }
        }
      })
    }

    source.classList.remove('drag')
    if (!targetRef.current) {
      targetRef.current = utils.getTileElementAtXY(pageX, pageY, source)
      b = utils.getTileElementData(targetRef.current)
    }

    // if finished dragging and no drop target, cancel
    if (b.index === -1) {
      springAPI.start((i) => ({ ...zero, onRest, backgroundColor: getBG(i) }))
      return
    }

    // otherwise, swap with drop target
    onSwap(a.index, b.index)
    const diff = { x: a.x - b.x, y: a.y - b.y }
    const o = utils.getTranslateXY(targetRef.current)
    targetRef.current = null

    // and animate back into place
    isAnimatingRef.current = true
    springAPI.start((index) => {
      if (index === b.index) {
        return {
          from: { x: mX + diff.x, y: mY + diff.y, backgroundColor: a.color },
          to: zero,
          onRest,
        }
      }
      if (index === draggedIndex) {
        return {
          from: { x: o.x - diff.x, y: o.y - diff.y, backgroundColor: b.color },
          to: zero,
        }
      }
      return zero
    })
  }

  const bindGestures = useDrag(onDrag)

  return { bindGestures, springs }
}

export default useGestures
