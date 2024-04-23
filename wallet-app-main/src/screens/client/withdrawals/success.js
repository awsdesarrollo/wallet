import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { Colors } from '../../../utils';
import { ScreenContainer } from '../../../components';
import { BackIcon, PaymentIcon } from '../../../assets/icons';
import { Logo } from '../../../assets/img';

class WithdrawalsSuccess extends React.Component {

  componentDidMount() {
    this.props.navigation.setParams({
      hideHeader: true,
    });
  }

  exit = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      })
    );
  }

  render() {
    return (
      <>
        <ScreenContainer backgroundColor={Colors.background}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.exit}>
              <Image source={BackIcon} style={styles.headerIcon} />
            </TouchableOpacity>
            <View style={styles.headerLogoWrapper}>
              <Image source={Logo} style={styles.headerLogo} />
            </View>
          </View>

          <View style={styles.content}>
            <Image source={PaymentIcon} style={styles.image} />
            <Text style={styles.message}>Su solicitud de retiro está siendo procesada.{'\n'}Le daremos respuesta lo antes posible.</Text>
          </View>

          <View>
            <TouchableOpacity style={styles.button} onPress={this.exit}>
              <Text style={styles.buttonText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </ScreenContainer>
      </>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.white,
  },
  headerLogoWrapper: {
    width: '100%',
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerLogo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  message: {
    textAlign: 'center',
    color: Colors.white,
  },
	button: {
		backgroundColor: Colors.blue,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
    marginVertical: 32,
    marginHorizontal: 20,
	},
	buttonText: {
		flex: 1,
		textAlignVertical: 'center',
		fontSize: 16,
		lineHeight: 18,
		color: Colors.white,
	},
});

export default connect((state) => ({
  user: state.user
}))(WithdrawalsSuccess);