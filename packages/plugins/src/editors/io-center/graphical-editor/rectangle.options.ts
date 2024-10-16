import {Connector} from "../interfaces/connector.interface";

export interface RectangleOptions {
  id: string;
  text?: string;
  textPosition?: 'top' | 'bottom';
  width: number;
  height: number;
  type: string;
  rectanglePosition: 'left' | 'middle' | 'right';
  inputConnectors?: Connector[]
  outputConnectors?: Connector[]
  // Add actions here
  onDelete?: () => void;
  onRouterAdd?: () => void;
  onConnectorEdit?: () => void;
}
