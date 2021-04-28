import * as React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useMutation, useQuery } from "react-query";

import { Button, Text, View } from "../components/Themed";
import { acModes, fanMode } from "../constants/ACRemoteFeatures";
import requestData from "../requests/requestData";
import sendObjectData from "../requests/sendObjectData";

const timeouts = {
    upButtonTimeout: { id: undefined, isExecuted: false },
    downButtonTimeout: { id: undefined, isExecuted: false },
    fanButtonTimeout: { id: undefined, isExecuted: false },
    ModeButtonTimeout: { id: undefined, isExecuted: false },
};

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function ACRemoteTabScreen() {
    const [dimensions, setDimensions] = React.useState({ window, screen });

    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    };
    React.useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    const getVHPercentage = (percantage: number) => {
        return dimensions.window.height * percantage;
    };

    const getVWPercentage = (percantage: number) => {
        return dimensions.window.width * percantage;
    };

    const [temp, setTemp] = React.useState(-1);
    const [fan, setFan] = React.useState(-1);
    const [mode, setMode] = React.useState(0);

    const [power, setPower] = React.useState(false);
    const [swing, setSwing] = React.useState(false);

    const registerTimeout = React.useCallback(
        (timeoutName: string, time: number, value: any) => {
            if (!timeouts[timeoutName]) {
                timeouts[timeoutName] = { id: undefined, isExecuted: false };
            }
            clearTimeout(timeouts[timeoutName].id);
            timeouts[timeoutName].id = setTimeout(() => {
                sendObject.mutate(value);
                timeouts[timeoutName].isExecuted = true;
            }, time);
        },
        [timeouts]
    );

    const dataQuery = useQuery("homeData", requestData, {
        onSuccess: (data) => {
            let obj = data.remote;
            setTemp(obj.temp);
            setFan(obj.fan);
            setPower(Boolean(obj.power));
            setSwing(Boolean(obj.swing));
        },
    });

    const sendObject = useMutation("sendingRemoteObjects", sendObjectData);

    return (
        <View style={styles.container}>
            {/* info display */}
            <View style={[styles.verticalColFlexContainer, { maxHeight: getVHPercentage(0.1) }]}>
                <View style={styles.horizontalRowFlexContainer}>
                    <Text>Temp:{temp} C</Text>
                    <Text>Fan:{fanMode[fan] ? fanMode[fan] : "Auto"}</Text>
                </View>
                <View style={styles.horizontalRowFlexContainer}>
                    <Text>Mode:{acModes[mode]}</Text>
                    <Text>Power:{power ? "🙉" : "🙈"}</Text>
                    <Text>Swing:{swing ? "🙉" : "🙈"}</Text>
                </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={[styles.belowVerticalColFlexContainer, { height: getVHPercentage(0.12), maxHeight: getVHPercentage(0.36) }]}>
                {/* power and fan button */}
                <View style={styles.horizontalRowFlexContainer}>
                    <View
                        onTouchEnd={(ev) => {
                            let obj = { remote: { power: power ? 0 : 1 } };
                            sendObject.mutate(obj);
                            setPower(!power);
                        }}
                        style={[
                            styles.powerButton,
                            power ? { backgroundColor: "green" } : { backgroundColor: "red" },
                            { height: getVHPercentage(0.045), width: getVHPercentage(0.045) },
                        ]}
                    ></View>
                    <Button
                        onPress={(ev) => {
                            if (fan < 0 || fan > 3) {
                                let obj = { remote: { fan: 0 } };
                                sendObject.mutate(obj);
                                setFan(0);
                                return;
                            }

                            let fanValue = (fan + 1) % 4;
                            let obj = { remote: { fan: fanValue } };
                            setFan(fanValue);
                            registerTimeout("fanButtonTimeout", 1000, obj);
                        }}
                        title={"Fan"}
                    ></Button>
                </View>
                {/* temp settings */}
                <View style={styles.horizontalRowFlexContainer}>
                    <View style={[styles.belowVerticalColFlexContainer, { height: getVHPercentage(0.12), maxHeight: getVHPercentage(0.36) }]}>
                        <View style={styles.tempFlex}>
                            <Button                                
                                onPress={(ev) => {
                                    if (temp >= 30) {
                                        return;
                                    }
                                    setTemp(temp + 1);
                                    let obj = { remote: { temp: temp + 1 } };
                                    registerTimeout("upButtonTimeout", 1000, obj);
                                }}
                                title={"▲"}
                            ></Button>
                        </View>
                        <View style={styles.tempFlex}>
                            <Button
                                onPress={(ev) => {
                                    if (temp <= 18) {
                                        return;
                                    }
                                    setTemp(temp - 1);
                                    let obj = { remote: { temp: temp - 1 } };
                                    registerTimeout("downButtonTimeout", 1000, obj);
                                }}
                                title={"▼"}
                            ></Button>
                        </View>
                    </View>
                </View>
                {/* mode and swing */}
                <View style={styles.horizontalRowFlexContainer}>
                    <Button            
                        onPress={(ev) => {
                            if (mode < 0 || mode > 4) {
                                let obj = { remote: { mode: 0 } };
                                sendObject.mutate(obj);
                                setMode(0);
                                return;
                            }
                            let modeNumber = (mode + 1) % 5;
                            let obj = { remote: { mode: modeNumber } };
                            registerTimeout("ModeButtonTimeout", 1000, obj);
                            setMode(modeNumber);
                        }}
                        title={"Mode"}
                    ></Button>
                    <Button
                        onPress={(ev) => {
                            let obj = { remote: { swing: swing ? 0 : 1 } };
                            sendObject.mutate(obj);
                            setSwing(!swing);
                        }}
                        title={"Swing"}
                    ></Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        // marginHorizontal: "2.5vw",
        marginHorizontal: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 12,
        height: 1,
        width: "80%",
    },
    horizontalRowFlexContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        // maxHeight: "4vh",
    },
    verticalColFlexContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        // maxHeight: "10vh",
    },
    belowVerticalColFlexContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        // height: "12vh",
        // maxHeight: "36vh",
    },
    powerButton: {
        borderWidth: 2,
        borderRadius: 32,
        borderColor: "rgba(0,0,0,.60)",
        // height: "4.5vh",
        // width: "4.5vh",
    },
    tempFlex: {
        width:64
    },
});
