import * as Linking from "expo-linking";

export default {
    prefixes: [Linking.makeUrl("/")],
    config: {
        screens: {
            Root: {
                screens: {
                    IndexTab: {
                        screens: {
                            IndexTabScreen: "maintab",
                        },
                    },
                    Remote: {
                        screens: {
                            ACRemoteTabScreen: "Remote",
                        },
                    },
                    TabOne: {
                        screens: {
                            TabOneScreen: "one",
                        },
                    },
                    TabTwo: {
                        screens: {
                            TabTwoScreen: "two",
                        },
                    },
                    Settings: {
                        screens: {
                            SettingsTabScreen: "settings",
                        },
                    },
                },
            },
            NotFound: "*",
        },
    },
};
