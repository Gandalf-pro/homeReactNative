import * as React from "react";
import { Dimensions, StyleSheet, Vibration } from "react-native";
import { TextInput } from "react-native";
import { ColorPicker, TriangleColorPicker, fromHsv, toHsv } from "react-native-color-picker";
import Slider, { SliderProps, SliderComponent } from "@react-native-community/slider";

import { Button, Text, View } from "../components/Themed";
import { Icon } from "react-native-elements";
import { useMutation, useQuery } from "react-query";
import requestData from "../requests/requestData";
import sendRGBColors from "../requests/sendRGBColor";
import sendObjectData from "../requests/sendObjectData";

const MySlider: React.FunctionComponent<SliderProps> = (props) => (
    <Slider style={{ width: 200, height: 40 }} maximumValue={1} minimumValue={0} minimumTrackTintColor="#FFFFFF" maximumTrackTintColor="#000000" />
);

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

function rgbToHex(r:any, g:any, b:any) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

function hexToRgb(hex: string) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

export default function IndexTabScreen() {

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


    const [leftColor, setLeftColor] = React.useState(toHsv('red'));
    const [rightColor, setRightColor] = React.useState(toHsv('red'));
    const [panjurState, setPanjurState] = React.useState("-1");
    const [lightLevel, setLightLevel] = React.useState(-1);

    const dataQuery = useQuery("homeData", requestData, {
        onSuccess: (data) => {
            setPanjurState(String(data.panjurState));
            setLightLevel(data.outLightLevel);
            //convert rgb values to hsv and write it
            //north leds
            setLeftColor(toHsv(rgbToHex(data.northLeds.r, data.northLeds.g, data.northLeds.b)));
            //east leds
            setRightColor(toHsv(rgbToHex(data.eastLeds.r, data.eastLeds.g, data.eastLeds.b)));
        },
    });

    const sendRGBData = useMutation('rgbSending', sendRGBColors);
    const sendObject = useMutation('sendingObjects', sendObjectData);

    if (dataQuery.isLoading) {
        return <Text>Loading kekw</Text>;
    }

    return (
        <View style={[styles.container,{marginHorizontal:getVWPercentage(.04),marginVertical:getVHPercentage(.04)}]}>
            <View style={[styles.aboveContainer,{minHeight:getVHPercentage(.06),maxHeight:getVHPercentage(.08)}]}>
                <Text>Panjur:</Text>
                <TextInput style={styles.panjurState} value={panjurState} onChangeText={setPanjurState}></TextInput>
                <Button
                    title="submit"
                    onPress={() => {
                        let obj: any = {};
                        obj['panjurState'] = panjurState;
                        sendObject.mutate(obj);
                        console.log("pressed submit panjur with value:",panjurState);
                    }}
                ></Button>
                <Text style={[styles.lightLevelText,{marginLeft:getVWPercentage(.02)}]}>Light Level: {lightLevel}</Text>
                <Icon name="refresh" size={46} onPress={() => { dataQuery.refetch();Vibration.vibrate()}} underlayColor="rgba(125, 125, 125, 0.08)"></Icon>
            </View>

            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={[{ maxHeight: getVHPercentage(.03) }, styles.horizontalRowFlexContainer]}>
                <Text>North</Text>
                <Text>East</Text>
            </View>
            <View style={[{ height: getVHPercentage(.4) }, styles.horizontalRowFlexContainer]}>
                <TriangleColorPicker
                    style={styles.leftColorPicker}
                    hideControls={true}
                    color={leftColor}
                    onColorChange={setLeftColor}
                    defaultColor="red"
                ></TriangleColorPicker>

                <TriangleColorPicker
                    style={styles.rightColorPicker}
                    hideControls={true}
                    color={rightColor}
                    onColorChange={(color) => {
                        setRightColor(color);
                        console.log("Color set to :", hexToRgb(fromHsv(color)), fromHsv(color));
                    }}
                    defaultColor="red"
                />
            </View>
            <View style={[{ height: getVHPercentage(.06) }, styles.horizontalRowFlexContainer]}>
                <Button
                    title={"Submit"}
                    onPress={(ev) => {
                        let obj: any = {};
                        obj['northLeds'] = hexToRgb(fromHsv(leftColor));
                        sendRGBData.mutate(obj);
                        console.log("Sending value:", hexToRgb(fromHsv(leftColor)));
                    }}
                ></Button>
                <Button
                    title={"Submit"}
                    onPress={(ev) => {
                        let obj: any = {};
                        obj['eastLeds'] = hexToRgb(fromHsv(rightColor));
                        sendRGBData.mutate(obj);
                        console.log("Sending value:", hexToRgb(fromHsv(rightColor)));
                    }}
                ></Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    aboveContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        // minHeight: "6vh",
        // maxHeight: "8vh",
        // height: "8vh",
    },
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        // marginHorizontal: "4vw",
        // marginVertical: "4vh",
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
    panjurState: {
        color: "white",
        marginHorizontal: 4,
        // marginHorizontal: ".5em",
        // width: "2.25em",
        width: 26,
        overflow: "hidden",
    },
    lightLevelText: {
        // marginLeft: "2vw",
        flex: 1,
        alignItems: "center",
    },
    leftColorPicker: {
        flex: 1,
        height: "100%",
    },
    rightColorPicker: {
        flex: 1,
        height: "100%",
    },
    horizontalRowFlexContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
});
