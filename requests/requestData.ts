import { HomeData } from "../types";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default async function requestData(): Promise<HomeData> {
    console.log("Requesting data");
    
    let ip = await AsyncStorage.getItem("defaultIp") || "192.168.1.1";
    let res = await axios.get(`http:\/\/` + ip + ':2564/', {  });
    return res.data;
}