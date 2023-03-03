import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { FaTemperatureHigh } from "react-icons/fa";
import { TbTemperatureCelsius } from "react-icons/tb";

const Weather = () => {

    const inputRef = useRef(null);

    const key_weather = process.env.REACT_APP_WEATHER_KEY;

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [cityName, setCityName] = useState("London"); //cityName from user in input

    const [dataCityName, setDataCityName] = useState(""); //dataCityName is cityName from data after search
    const [weatherType, setWeatherType] = useState("");
    const [weatherDegree, setWeatherDegree] = useState("");

    const [weatherImage, setWeatherImage] = useState("");

    const handleChange = (e) => {
        setCityName(e.target.value);
    }
    const handleSubmit = async () => {

        try {
            const dataFromApi = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key_weather}`)
            setDataCityName(dataFromApi.data.name);
            setWeatherType(dataFromApi.data.weather[0].main);
            setWeatherDegree(dataFromApi.data.main.temp - 273.15);
            inputRef.current.value = "";
            inputRef.current.focus();
        } catch (error) {
            setDataCityName("City is not found");
            setWeatherType("");
            setWeatherDegree("");
        }
    }

    const getLatLong = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                setLatitude(latitude);
                setLongitude(longitude);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    useEffect(() => {   //first started here cuz of useeffect
        getLatLong();
        console.log("Made by Tugcan Kartal")
    }, [])

    useEffect(() => {
        if (latitude && longitude) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key_weather}`)
                .then(res => {
                    setDataCityName(res.data.name);
                    setWeatherType(res.data.weather[0].main);
                    setWeatherDegree(res.data.main.temp - 273.15);
                })
                .catch(err => console.log(err))
        }
    }, [latitude, longitude])

    useEffect(()=>{                 //Every changes in weatherType it changes imgUrl too.
      if(weatherType==="Clear"){    //And also this useEffect worked before open app too so with that default city weather type finds image too
        setWeatherImage("https://cdn-icons-png.flaticon.com/512/6974/6974833.png")
      }else if(weatherType==="Rain"){
        setWeatherImage("https://cdn-icons-png.flaticon.com/512/3351/3351979.png")
      }else if(weatherType==="Snow"){
        setWeatherImage("https://cdn-icons-png.flaticon.com/512/642/642102.png")
      }else if(weatherType==="Clouds"){
        setWeatherImage("https://cdn-icons-png.flaticon.com/512/414/414825.png")
      }else if(weatherType==="Haze"){
        setWeatherImage("https://cdn-icons-png.flaticon.com/512/1197/1197102.png")
      }else if(weatherType==="Smoke"){
        setWeatherImage("https://cdn-icons-png.flaticon.com/512/4380/4380458.png")
      }else if(weatherType==="Mist"){
        setWeatherImage("https://cdn-icons-png.flaticon.com/512/4005/4005901.png")
      }else if(weatherType==="Drizzle"){
        setWeatherImage("https://cdn-icons-png.flaticon.com/512/3076/3076129.png")
      }else if(weatherType===""){
        setWeatherImage("https://cdn-icons-png.flaticon.com/512/4275/4275497.png")
      }
    },[weatherType])

    

  return (
    <div className='h-screen bg-gray-200 flex flex-col justify-center items-center gap-y-6'>

        <div>
            <input onKeyDown={(event)=>{if(event.key==="Enter"){handleSubmit()}}} className='bg-gray-200 text-xl border-b p-1 border-gray-800 font-semibold uppercase outline-none' type="text" ref={inputRef} onChange={handleChange} placeholder='City Name'/>
            <button onClick={handleSubmit}>
                <FaSearch />
            </button>
        </div>

        <div>
          <div className='text-2xl font-bold mt-8'>{dataCityName}</div>
        </div>

        <div>
          <div>
            <img className='md:h-[50vh] h-[33vh]' alt='not found' src={weatherImage} />
          </div>
          <div className='text-xl font-semibold text-center mt-4'>{weatherType}</div>
        </div>

        <div className='flex relative'>
          <div className='text-2xl pr-4 absolute right-8 bottom-1'><FaTemperatureHigh /></div>
          <div className='text-2xl font-semibold ml-9'>{weatherDegree ? Math.round(weatherDegree) : "?"}</div>
          <div className='text-3xl'><TbTemperatureCelsius /></div>
        </div>

    </div>
  )
}

export default Weather