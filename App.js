import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  Layout,
  Card,
  Radio,
  RadioGroup,
  Button,
  Spinner,
  Modal
} from '@ui-kitten/components';
import Axios from 'axios';

const { width, height } = Dimensions.get("window");

const API_ROOT = 'https://id3treedecisive.herokuapp.com/id3';

export default function App() {

  const [visible, setVisible] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [feelLikeTemp, setFeelLikeTemp] = React.useState(0);
  const [description, setDescription] = React.useState("");
  const [location, setLocation] = React.useState('Thủ đô Hà Nội');
  const [temp, setTemp] = React.useState();
  const [windSpeed, setWindSpeed] = React.useState();
  const [humidity, setHumidity] = React.useState();
  const [weatherIcon, setWeatherIcon] = React.useState('');
  const [suggestion, setSuggetion] = React.useState('');
  const [error, setError] = React.useState(false);
  const [loadingWeather, setLoadingWeather] = React.useState(false);
  const [loadingGetSuggestion, setLoadingGetSuggestion] = React.useState(false);
  const [loadingPostSuggestion, setLoadingPostSuggestion] = React.useState(false);

  let icon = '';

  React.useEffect(() => {
    getWeatherInfo('1581129');
  }, [])

  const locationChange = (index) => {
    setSelectedIndex(index)

    switch (index) {
      case 0:
        getWeatherInfo('1581129');
        setLocation('Thủ đô Hà Nội');
        break;

      case 1:
        getWeatherInfo('1905468');
        setLocation('Thành phố Đà Nẵng');
        break;

      case 2:
        getWeatherInfo('1580578');
        setLocation('Thành phố Hồ Chí Minh');
        break;

      default:
        getWeatherInfo('1581129');
        setLocation('Thủ đô Hà Nội');
        break;
    }
  }



  const getWeatherInfo = async (id) => {
    setLoadingWeather(true)
    let url = 'https://api.openweathermap.org/data/2.5/weather?id=' + id + '&lang=vi&appid=e764d3c4a1ea30c95aaea83beea1d309';
    await Axios.get(url)
      .then(response => {
        setFeelLikeTemp(convertToCelcius(response.data.main.feels_like));
        setTemp(response.data.temp);
        setDescription(response.data.weather[0].description);
        setWindSpeed(response.data.wind.speed);
        setHumidity(response.data.clouds.all);
        setTemp(convertToCelcius(response.data.main.temp));
        setWeatherIcon(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
        icon = response.data.weather[0].icon;
        setLoadingWeather(false);
        getSuggest();
      })
      .catch(e => {

      })
  }

  const convertToCelcius = (valNum) => {
    return Math.round(valNum - 273.15);
  }

  const getSuggest = async () => {
    setLoadingGetSuggestion(true);
    let outlook = getOutlook(icon)
    let tempin = parseInt(temp)
    let wind = (windSpeed > 2) ? true : false
    let date = getDay()

    const API_REVIEW = `${API_ROOT}?wind=${wind}&outlook=${outlook}&date=${date}&temp=${parseInt(tempin)}`;
    console.log(API_REVIEW);

    await Axios.get(API_REVIEW)
      .then(response => {
        console.log(response.data)
        if (response.data.statusCode === 200) {
          setSuggetion(response.data.message)
        } else {
          setVisible(true);
          setError(true);
        }
        setLoadingGetSuggestion(false);
      })
      .catch(e => {
        setLoadingGetSuggestion(false);
        setVisible(true);
        setError(true);
      })
  }

  const getOutlook = (key) => {
    let result = "rain"

    switch (key) {
      case "01d":
      case "01n":
      case "02d":
      case "02n":
        result = "sunny"
        break;
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        result = "overcast"
        break;
      case "09d":
      case "09n":
      case "10d":
      case "10n":
      case "11d":
      case "11n":
        result = "rainy"
        break;

      default:
        break;
    }

    return result
  }

  const getDay = () => {
    const day = new Date().getDay();
    let result = "weekend"

    switch (day) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        result = "midweek"
        break;
      default:
        result = "weekend"
        break;
    }

    return result;
  }

  const SubmitSuggestion = (review) => {
    setLoadingPostSuggestion(true);
    let outlook = getOutlook(icon)
    let tempin = parseInt(temp)
    let wind = (windSpeed > 2) ? true : false
    let date = getDay()

    let data = {
      outlook: outlook,
      temp: tempin,
      wind: wind,
      date: date,
      decisive: review
    }

    Axios.post(API_ROOT, {
      ...data
    })
      .then(response => {
        console.log(response.data)
        setLoadingPostSuggestion(false);
        if (response.data.statusCode != 200) {
          setVisible(true);
          setError(true);
        }
      })
      .catch(e => {
        setVisible(true);
        setLoadingPostSuggestion(false);
        setError(true);
      })
  }

  const closeWarning = () => {
    setVisible(false);
    setError(false);
  }

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark }} >
      <Layout style={{
        flex: 1,
        alignItems: 'center',
        paddingTop: 20
      }}>
        <Card style={{
          width: width,
          height: height / 3,
          backgroundColor: 'white',
          marginLeft: 20,
          marginRight: 20,
        }}
          header={() => <Header location={location} />}
        >
          {
            loadingWeather ? (
              <View style={{
                width: width,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Spinner />
              </View>
            ) :
              (
                <View style={{ justifyContent: 'space-between' }}>
                  <View
                    style={{
                      flexDirection: 'row'
                    }}>
                    <View style={{ width: width / 3 }}>
                      <Text style={styles.text}> Nhiệt độ cảm nhận được</Text>
                      <Text style={styles.text}>{feelLikeTemp} (°C)</Text>
                    </View >
                    <View style={{ width: width / 3 }}>
                      <Image
                        style={{
                          width: 100,
                          height: 100
                        }}
                        source={{ uri: weatherIcon }} />
                    </View>
                    <View style={{ width: width / 3 }}>
                      <View>
                        <Text style={styles.text}>{description}</Text>
                      </View>
                    </View>
                  </View>
                  <View >
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: width / 3 }}>
                        <Text style={styles.text}>{windSpeed}</Text>
                        <Text style={styles.text}>Tốc độ gió</Text>
                      </View>
                      <View style={{ width: width / 3 }}>
                        <Text style={styles.text}>{humidity}</Text>
                        <Text style={styles.text}>Độ ẩm</Text>
                      </View>
                      <View style={{ width: width / 3 }}>
                        <Text style={styles.text}>{temp}</Text>
                        <Text style={styles.text}>Nhiệt độ (°C)</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
          }
        </Card>
        <View style={{
          width: width,
          borderColor: 'white',
          borderWidth: 0.5,
          backgroundColor: 'white',
          height: 50,
          borderRadius: 5,
          marginTop: 10,
          justifyContent: 'center'
        }}>
          <RadioGroup
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
            selectedIndex={selectedIndex}
            onChange={index => locationChange(index)}
          >
            <Radio><Text style={{ color: 'black' }}>Hà Nội</Text></Radio>
            <Radio><Text style={{ color: 'black' }}>Đà Nẵng</Text></Radio>
            <Radio><Text style={{ color: 'black' }}>TP Hồ Chí Minh</Text></Radio>
          </RadioGroup>
        </View>
        <View style={{
          width: width,
          borderColor: 'white',
          borderWidth: 0.5,
          backgroundColor: '#2ef26f',
          height: 50,
          borderRadius: 5,
          marginTop: 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {
            loadingGetSuggestion ? (
              <Spinner />
            ) : (
                <View>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{suggestion === 'yes' ? 'Nên đi' : 'Không nên đi'}</Text>
                </View>
              )
          }
        </View>
        <View style={{ marginTop: 60 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            VỚI THỜI TIẾT NÀY BẠN CÓ ĐI KHÔNG ?
            </Text>
        </View>
        <View>
          {
            loadingPostSuggestion ? (
              <View style={{
                marginTop: 20
              }}>
                <Spinner />
              </View>
            ) : (
                <View>
                  <Button style={{
                    width: width / 2,
                    marginTop: 20
                  }} appearance='outline'
                    onPress={() => SubmitSuggestion('yes')}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                      CÓ
                  </Text>
                  </Button>
                  <Button style={{
                    width: width / 2,
                    marginTop: 20
                  }} appearance='outline'
                    onPress={() => SubmitSuggestion('no')}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                      KHÔNG
                    </Text>
                  </Button>
                </View>
              )
          }
        </View>
        <Modal
          visible={visible}
          backdrpStyle={{
            backgroundColor: 'white',
            width: 100
          }}
          onBackdropPress={() => setVisible(false)}
        >
          <Card disabled={true}>
            <Text>{
              error ? (
                'Có lỗi xảy ra'
              ) :
                'Thành công!😻'
            }</Text>
            <Button
              onPress={() => closeWarning()}>
              Đóng
          </Button>
          </Card>
        </Modal>
      </Layout>
    </ApplicationProvider>
  );
}

const Header = ({ location }) => {
  return (
    <View style={{
      height: height / 15,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: "#e6e6e6",
      borderBottomWidth: 1,
    }}>
      <Text category='h6' style={{
        color: "black",
        fontWeight: 'bold',
        fontSize: 20,
      }}>{location}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: 'black'
  }
})

