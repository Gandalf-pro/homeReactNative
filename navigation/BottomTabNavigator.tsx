import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import IndexTabScreen from "../screens/IndexTabScreen";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import SettingsTabScreen from "../screens/SettingsTabScreen";
import { BottomTabParamList, TabOneParamList, TabTwoParamList, SettingsTabParamList, IndexTabParamList, ACRemoteTabParamList } from "../types";
import ACRemoteTabScreen from "../screens/ACRemoteTabScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
		<BottomTab.Navigator initialRouteName="IndexTab" tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
			<BottomTab.Screen
                name="IndexTab"
                component={IndexTabNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Remote"
                component={ACRemoteTabNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Settings"
                component={SettingsTabNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
                }}
            />
        </BottomTab.Navigator>
    );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>["name"]; color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
    return (
        <TabOneStack.Navigator>
            <TabOneStack.Screen name="TabOneScreen" component={TabOneScreen} options={{ headerTitle: "Tab One Title" }} />
        </TabOneStack.Navigator>
    );
}

const IndexTabStack = createStackNavigator<IndexTabParamList>();

function IndexTabNavigator() {
    return (
        <IndexTabStack.Navigator>
            <IndexTabStack.Screen name="IndexTabScreen" component={IndexTabScreen} options={{ headerTitle: "Main" }} />
        </IndexTabStack.Navigator>
    );
}

const ACRemoteTabStack = createStackNavigator<ACRemoteTabParamList>();

function ACRemoteTabNavigator() {
    return (
        <ACRemoteTabStack.Navigator>
            <ACRemoteTabStack.Screen name="ACRemoteTabScreen" component={ACRemoteTabScreen} options={{ headerTitle: "Remote" }} />
        </ACRemoteTabStack.Navigator>
    );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
    return (
        <TabTwoStack.Navigator>
            <TabTwoStack.Screen name="TabTwoScreen" component={TabTwoScreen} options={{ headerTitle: "Tab Two Title" }} />
        </TabTwoStack.Navigator>
    );
}

const SettingsTabStack = createStackNavigator<SettingsTabParamList>();

function SettingsTabNavigator() {
    return (
        <SettingsTabStack.Navigator>
            <SettingsTabStack.Screen name="SettingsTabScreen" component={SettingsTabScreen} options={{ headerTitle: "Settings" }} />
        </SettingsTabStack.Navigator>
    );
}
