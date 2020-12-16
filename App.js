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
  Button
} from '@ui-kitten/components';

const { width, height } = Dimensions.get("window");

export default function App() {

  const [selectedIndex, setSelectedIndex] = React.useState(0);

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
          header={Header}
        >
          <View style={{ justifyContent: 'space-between' }}>
            <View
              style={{
                flexDirection: 'row'
              }}>
              <View style={{ width: width / 3 }}>
                <Text style={styles.text}> Nhiệt độ cảm nhận được</Text>
                <Text style={styles.text}>8.99 (°C)</Text>
              </View >
              <View style={{ width: width / 3 }}>
                <Image
                  style={{
                    width: 100,
                    height: 100
                  }}
                  source={{ uri: "https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/sun-512.png" }} />
              </View>
              <View style={{ width: width / 3 }}>
                <View>
                  <Text style={styles.text}>Mây đen u ám</Text>
                </View>
              </View>
            </View>
            <View >
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: width / 3 }}>
                  <Text style={styles.text}>4.1</Text>
                  <Text style={styles.text}>Tốc độ gió</Text>
                </View>
                <View style={{ width: width / 3 }}>
                  <Text style={styles.text}>90</Text>
                  <Text style={styles.text}>Độ ẩm</Text>
                </View>
                <View style={{ width: width / 3 }}>
                  <Text style={styles.text}>14.00</Text>
                  <Text style={styles.text}>Nhiệt độ (°C)</Text>
                </View>
              </View>
            </View>
          </View>
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
            onChange={index => setSelectedIndex(index)}
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
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>NÊN ĐI</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Button style={{
            width: width,

          }} appearance='outline'>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              ĐÁNH GIÁ
            </Text>
          </Button>
        </View>
        <View style={{ marginTop: 60 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              VỚI THỜI TIẾT NÀY BẠN CÓ ĐI KHÔNG ?
            </Text>
        </View>
        <View>
        <Button style={{
            width: width / 2,
            marginTop: 20
          }} appearance='outline'>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              CÓ
            </Text>
          </Button>
          <Button style={{
            width: width / 2,
            marginTop: 20
          }} appearance='outline'>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              KHÔNG
            </Text>
          </Button>
        </View>
      </Layout>
    </ApplicationProvider>
  );
}

const Header = (props) => (
  <View {...props} style={{
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
    }}>Thủ đô Hà Nội</Text>
  </View>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: 'black'
  }
})

