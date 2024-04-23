import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { Path, Svg } from 'react-native-svg';
import { CustomHeader, Menu, ScreenContainer } from '../../../components';
import { Colors, Fonts, Constants, Globals } from '../../../utils';
moment.locale('es');

const WIDTH = Dimensions.get('window').width;

class Home extends React.Component {

  state = {
    form: {
      
    },
    orders: [],
    pagination: {
      page: 1,
      total: 0,
      perPage: Constants.PER_PAGE,
      pages: 0
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      hideHeader: true
    });

    this.focusListener = this.props.navigation.addListener('focus', async () => {
      this.getOrders();
    });
  }

  getOrders = async (page = 1) => {
    try {
      // const res = await OrdersService.findAll({ page, ...this.state.form });
      // const { data, ...rest } = res;
      // this.setState({
      //   orders: data,
      //   pagination: rest,
      // });

    } catch (error) {
      console.log(error)
      Globals.sendToast('Error al obtener las ordenes', Colors.red)
    }
  }

  change = async (value, target) => {
    await this.setState({
      form: { ...this.state.form, [target]: value },
      orders: [],
    });

    this.getOrders();
  }

  render() {

    const { user } = this.props;

    return (
      <>
        <CustomHeader title="¡Bienvenido de nuevo!" />

        <ScreenContainer backgroundColor="#262750" verticalScroll={false}>
          <View>
            <View style={styles.subHeader}>
              <Text style={styles.subHeaderAmount}>{ Globals.formatMiles(user?.balance + user?.performance) }</Text>
              <Text style={styles.subHeaderBalance}>Balance disponible</Text>
            </View>
            <View style={styles.vecContainer}>
              <CustomCurve />
            </View>
          </View>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemLabel}>Saldo inicial</Text>
              <Text style={styles.itemDate}>{ moment(user?.balance_date).format('DD/MM/YYYY') }</Text>
            </View>
            <Text style={styles.itemTotal}>{ Globals.formatMiles(user?.balance) }</Text>
          </View>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemLabel}>Rendimiento</Text>
              <Text style={styles.itemDate}>{ moment().format('DD/MM/YYYY') }</Text>
            </View>
            <Text style={styles.itemTotal}>{ Globals.formatMiles(user?.performance) }</Text>
          </View>
        </ScreenContainer>
        <Menu />
      </>
    )
  }
}

const CustomCurve = () => {
  const w  = WIDTH; // Full device width
  const hw = WIDTH / 2; // Half With
  const h  = 10; // Height
  const br = 20; // Border Radius
  const cw = 180; // Circle Width
  const cr = cw / 2; // Circle Radius
  const lp = hw - cr - br; // Left Point
  const rp = hw + cr + br; // Right Point
  const sw = 2; // Stroke Width

  return (
    <Svg
      width={WIDTH}
      height={100}
      viewBox={`0 0 ${WIDTH} ${100}`}
      fill={Colors.background}
    >
      <Path
        d={`
          M${w} -${sw}
          H-${sw}
          V${h}
          H${lp}
          C${lp + 11.0457} ${h} ${lp + 19.77} ${h + 9.068} ${lp + 22.195} ${h + 19.844}
          C${lp + 31.232} ${h + 60.002} ${lp + 67.113} ${h + 90} ${lp + 110} ${h + 90}
          C${rp - 68.887} ${h + 90} ${rp - 32.768} ${h + 60.002} ${rp - 23.805} ${h + 19.844}
          C${rp - 20.23} ${h + 9.068} ${rp - 12.954} ${h} ${rp} ${h}
          H${w + sw}
          V0
          Z
        `}
        stroke="#2B295D"
        strokeWidth={sw}
      />
    </Svg>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 20,
    borderRadius: 50,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#2B295D',
  },
  itemLabel: {
    fontSize: 16,
    color: '#5C5988',
  },
  itemDate: {
    fontSize: 12,
    color: '#5C5988',
  },
  itemTotal: {
    fontFamily: Fonts.BOLD,
    fontSize: 16,
    color: Colors.white,
  },
  subHeader: {
    backgroundColor: Colors.background,
    paddingTop: 20,
    position: 'relative',
  },
  subHeaderAmount: {
    fontFamily: Fonts.SEMIBOLD,
    fontSize: 28,
    color: Colors.white,
    textAlign: 'center',
  },
  subHeaderBalance: {
    fontSize: 20,
    color: '#5C5988',
    textAlign: 'center',
  },
  vecContainer: {
    width: WIDTH,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsText: {
    color: Colors.gray3,
  },
  noItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '70%',
    backgroundColor: Colors.green,
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonLoadMore: {
    width: '50%',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginVertical: 16,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: Fonts.BOLD,
    color: Colors.white,
  },
});

export default connect(state => ({
  user: state.user,
  last_notification: state.last_notification,
}))(Home);