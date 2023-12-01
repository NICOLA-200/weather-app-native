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
 