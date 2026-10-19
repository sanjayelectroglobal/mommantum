/**
 * @file use-toggle-state.tsx
 * @description Reusable hook for managing boolean modal, drawer, and toggle states.
 * 
 * WHAT: Provides state and toggle/open/close handlers supporting both array and object destructuring.
 * WHY: Standardizes open/close logic across UI components (menus, sheets, dialogs) without repetitive boilerplate.
 */

"use client"
import { useState } from "react"

export type StateType = [boolean, () => void, () => void, () => void] & {
  state: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * useToggleState
 * 
 * @param initialState - Default boolean state (defaults to false)
 * @returns Array-like object with [state, open, close, toggle] and { state, open, close, toggle }
 */
const useToggleState = (initialState = false) => {
  // Primary boolean state
  const [state, setState] = useState<boolean>(initialState)

  // Force closed
  const close = () => {
    setState(false)
  }

  // Force open
  const open = () => {
    setState(true)
  }

  // Toggle current state
  const toggle = () => {
    setState((prevState) => !prevState)
  }

  // Support both tuple destructuring [open, close, ...] and object destructuring { open, close, ... }
  const hookData = [state, open, close, toggle] as StateType
  hookData.state = state
  hookData.open = open
  hookData.close = close
  hookData.toggle = toggle

  return hookData
}

export default useToggleState
