import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid'
import { debounce } from "lodash";
import { theme } from '../theme';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import * as Progress from 'react-native-progress';
import { StatusBar } from 'expo-status-bar';
import { weatherImages } from '../constants';
import { getData, storeData } from '../utils/asyncStorage';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({})

  
  const handleSearch = search=>{
     // console.log('value: ',search);
     if(search && search.length>2)
       fetchLocations({cityName: search}).then(data=>{
         // console.log('got locations: ',data);
         setLocations(data);
       })
   }
 
   const handleLocation = loc=>{
     setLoading(true);
     toggleSearch(false);
     setLocations([]);
     fetchWeatherForecast({
       cityName: loc.name,
       days: '7'
     }).then(data=>{
       setLoading(false);
       setWeather(data);
       storeData('city',loc.name);
     })
   }

   useEffect(()=>{
     fetchMyWeatherData();
   },[]);
 
   const fetchMyWeatherData = async ()=>{
     let myCity = await getData('city');
     let cityName = 'Kigali';
     if(myCity){
       cityName = myCity;
     }
     fetchWeatherForecast({
       cityName,
       days: '7'
     }).then(data=>{
       // console.log('got data: ',data.forecast.forecastday);
       setWeather(data);
       setLoading(false);
     })
     
   }
 
   const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
 
   const {location, current} = weather;
 
   return (
     <View className="flex-1 relative">
       
       <Image 
         blurRadius={70} 
         source={require('../assets/images/bg.png')} 
         className="absolute w-full h-full" />
         {
           loading? (
             <View className="flex-1 flex-row justify-center items-center">
               <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
             </View>
           ):(
             <SafeAreaView className="flex flex-1">
               {/* search section */}
               <View style={{height: '7%'}} className="mx-4 relative z-50">
                 <View 
                   className="flex-row justify-end items-center rounded-full" 
                   style={{backgroundColor: showSearch? theme.bgWhite(0.2): 'transparent'}}>
                   
                     {
                       showSearch? (
                         <TextInput 
                           onChangeText={handleTextDebounce} 
                           placeholder="Search city" 
                           placeholderTextColor={'lightgray'} 
                           className="pl-6 h-10 pb-1 flex-1 text-base text-white" 
                         />
                       ):null
                     }
                     <TouchableOpacity 
                       onPress={()=> toggleSearch(!showSearch)} 
                       className="rounded-full p-3 m-1" 
                       style={{backgroundColor: theme.bgWhite(0.3)}}>
                       {
                         showSearch? (
                           <XMarkIcon size="25" color="white" />
                         ):(
                           <MagnifyingGlassIcon size="25" color="white" />
                         )
                       }
                       
                   </TouchableOpacity>
                 </View>
                 {