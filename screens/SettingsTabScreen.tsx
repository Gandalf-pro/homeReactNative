import * as React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { TextInput } from "react-native";

import { Text, View } from "../components/Themed";

import AsyncStorage from "@react-native-async-storage/async-storage";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function SettingsTabScreen() {
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

    const [ipAddress, setIpAddress] = React.useState("");

    const setDefaultIp = React.useCallback(async () => {
        console.log("Done editing ip:", ipAddress);
        AsyncStorage.setItem("defaultIp", ipAddress);
    }, [ipAddress]);

    //component did mount
    React.useEffect(() => {
        //get default ip
        AsyncStorage.getItem("defaultIp").then((val) => {
            setIpAddress(val || "192.168.1.1");
        });
    }, []);

    return (
        <View style={[styles.container, { marginLeft: dimensions.window.width * 0.04 }]}>
            <View style={[styles.horizontalRowFlexContainer, {maxHeight:dimensions.window.height *0.04}]}>
                <Text>Ip:</Text>
                <TextInput
                    style={styles.IpTextInput}
                    value={ipAddress}
                    onChangeText={setIpAddress}
                    textContentType="URL"
                    onSubmitEditing={setDefaultIp}
                ></TextInput>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        // marginLeft: "4vw",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    IpTextInput: {
        color: "white",
        marginLeft: 6,
    },
    horizontalRowFlexContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        // maxHeight: "4vh",
    },
});
