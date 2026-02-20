declare global {
  interface GlobalThis {
    IS_REACT_ACT_ENVIRONMENT?: boolean
  }
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true

export {}
