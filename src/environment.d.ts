declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      HOST?: string;
      ADMIN_PANEL_PASS?: string;
    }
  }
}

export {}
