declare module 'react-helmet' {
  import * as React from 'react';

  export interface HelmetProps {
    children?: React.ReactNode;
    title?: string;
    defaultTitle?: string;
    titleTemplate?: string;
    defer?: boolean;
    encodeSpecialCharacters?: boolean;
    onChangeClientState?: (...args: any[]) => void;
  }

  export default class Helmet extends React.Component<HelmetProps> {}
}

