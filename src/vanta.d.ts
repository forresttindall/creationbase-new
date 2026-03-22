declare module 'vanta/dist/vanta.topology.min';
declare global {
  interface Window {
    VANTA?: {
      TOPOLOGY?: (options: any) => { destroy: () => void; resize?: () => void };
    };
  }
}
