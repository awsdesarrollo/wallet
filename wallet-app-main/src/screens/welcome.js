import React, { Component } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Logo, LogoMono, LogoWhite, Welcome1, Welcome1_1, Welcome1_2, Welcome1_3, Welcome2 } from '../assets/img';
import { Colors, Fonts, Globals } from '../utils';

class Welcome extends Component {

  state = {
    page: 1,
  }

	componentDidMount() {
		this.props.navigation.setParams({ hideHeader: true });
	}

  initialize = () => {
    this.setState({ page: 3 });

    setTimeout(() => {
      this.props.navigation.navigate('Login');
    }, 2000);
  }

  render() {
    return (
      <>
        {this.state.page === 1 && (
          <TouchableOpacity
            style={styles1.container}
            activeOpacity={1}
            onPress={() => this.setState({ page: 2 })}
          >
            <ImageBackground source={Welcome1} style={styles1.bg} />
            <View style={styles1.topContainer}>
              <Image source={LogoMono} style={styles1.logoMono} fadeDuration={0} />
            </View>
            <View style={styles1.bottomContainer}>
              <Image source={Welcome1_1} style={styles1.img1} fadeDuration={0} />
              <Image source={Welcome1_2} style={styles1.img2} fadeDuration={0} />
              <Image source={Welcome1_3} style={styles1.img3} fadeDuration={0} />
            </View>
          </TouchableOpacity>
        )}

        {this.state.page === 2 && (
          <View style={styles2.container}>
            <ImageBackground source={Welcome2} style={styles2.bg} />
            <View style={{ position: 'absolute', width: '100%', height: '40%', bottom: 0, backgroundColor: '#04243A' }} />
            <View style={styles2.topContainer}>
              <Image source={LogoWhite} style={styles2.logoMono} fadeDuration={0} />
            </View>
            <View style={styles2.middleContainer}>
              <Text style={styles2.mainText}>Podrás{'\n'}revisar tus{'\n'}inversiones{'\n'}en tiempo{'\n'}real</Text>
              <Text style={styles2.detailText}>Invierte con confianza y asegura tu futuro. Haz crecer tu patrimonio, sin esfuerzo, tu inversión está en tu control.</Text>
            </View>
            <View style={styles2.bottomContainer}>
              <TouchableOpacity
                style={styles2.button}
                activeOpacity={0.8}
                onPress={this.initialize}
              >
                <Text style={styles2.buttonText}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {this.state.page === 3 && (
          <View style={styles3.container}>
            <View style={styles3.topContainer}>
              <Image source={Logo} style={styles3.logo} />
            </View>
            <View style={styles3.bottomContainer}>
              <ActivityIndicator color={Colors.white} size={40} />
            </View>
          </View>
        )}
      </>
    )
  }
}

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#0D1015',
  },
  bg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50,
  },
  bottomContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  logoMono: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  img1: {
    height: Globals.getImageHeight(Welcome1_1),
    resizeMode: 'contain',
    marginBottom: 20,
  },
  img2: {
    height: Globals.getImageHeight(Welcome1_2),
    resizeMode: 'contain',
    marginBottom: 20,
  },
  img3: {
    height: Globals.getImageHeight(Welcome1_3),
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  bg: {
    width: '100%',
    height: Globals.getImageHeight(Welcome2),
    position: 'absolute',
    resizeMode: 'contain',
  },
  topContainer: {
    justifyContent: 'center',
    marginVertical: 50,
    alignItems: 'center',
  },
  middleContainer: {
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  logoMono: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  mainText: {
    fontFamily: Fonts.SEMIBOLD,
    fontSize: 44,
    lineHeight: 60,
    color: Colors.white,
  },
  detailText: {
    marginTop: 20,
    color: Colors.white,
  },
	button: {
		backgroundColor: Colors.blue,
		height: 40,
		borderRadius: 20,
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	buttonText: {
		flex: 1,
		textAlignVertical: 'center',
		fontSize: 16,
		lineHeight: 18,
		color: Colors.white,
	},
});

const styles3 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  topContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  }
});

export default Welcome;