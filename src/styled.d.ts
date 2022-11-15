import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    flexCenter: ThemedCssFunction;
    flexDefault: ThemedCssFunction;
    flexColumn: ThemedCssFunction;
    bg: {
      lightBlue: string;
      darkBlue: string;
      grey: string;
      white: string;
    };
  }
}
