export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  Settings: undefined;
  IndexTab: undefined;
  Remote: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type SettingsTabParamList = {
  SettingsTabScreen: undefined;
};

export type IndexTabParamList = {
  IndexTabScreen: undefined;
};

export type ACRemoteTabParamList = {
  ACRemoteTabScreen: undefined;
};

export type HomeData = {
  panjurState: number,
    light0: boolean,
    outTemp: number,
    outHumidity: number,
    outLightLevel: number,
    remote: {
        power: number,
        temp: number,
        fan: number,
        mode: number,
        swing: number,
    },
    northLeds: { r: number, g: number, b: number, effect: string, rate: number },
    eastLeds: { r: number, g: number, b: number, effect: string, rate: number },
    gandalfPcOpen: boolean,
};
