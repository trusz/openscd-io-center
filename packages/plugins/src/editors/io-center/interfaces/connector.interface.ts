export interface Connector {
  id: string;
  text: string;
  type: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  spacing?: number;
}
