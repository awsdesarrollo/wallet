import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AuthService, OrdersService } from '../../../services';
import { CustomHeader, Input, Menu, ScreenContainer, Select } from '../../../components';
import { Colors, Constants, Globals } from '../../../utils';

const withdrawalMethods = [
  { value: Constants.WITHDRAWAL_METHOD.CASH, label: 'Efectivo' },
  { value: Constants.WITHDRAWAL_METHOD.WALLET, label: 'Wallet' },
];

const fundsSources = [
  { value: Constants.ORDER.FUNDS_SOURCE.BALANCE, label: 'Saldo inicial' },
  { value: Constants.ORDER.FUNDS_SOURCE.PERFORMANCE, label: 'Rendimiento' },
];

class Withdrawals extends React.Component {

  state = {
    form: {
      payment_method_id: '',
      funds_source_id: '',
      amount: '',
      amount_formatted: '0,00',
      wallet: '',
    },
  }

  componentDidMount() {
    this.props.navigation.setParams({
      hideHeader: true
    });
  }

  change = async (value, target) => {
    await this.setState(s => ({
      form: {
        ...s.form,
        [target]: value,
        amount_formatted: target === 'amount'
          ? Globals.formatMiles(value / 100,2,'')
          : s.form.amount_formatted,
      },
    }));
  }

  goToNotifications= () => {

  }

  showOptions = () => {

  }

  isValidForm = () => {
    const onError = (msg) => {
      Globals.sendToast(msg);
      return false;
    }

    const { form } = this.state;
    const { user } = this.props;

    const currentAmount = form.funds_source_id === Constants.ORDER.FUNDS_SOURCE.BALANCE
      ? user?.balance || 0
      : user?.performance || 0;

    let total = parseFloat(parseFloat(form.amount / 100).toFixed(2));

    if (form.payment_method_id === Constants.ORDER.PAYMENT_METHOD.CASH) {
      total += (total * 0.02);
    }

    if (currentAmount < total)
      return onError('Saldo insuficiente');

    return true;
  }

  submit = async () => {
    if (!this.isValidForm()) return;

    const { form } = this.state;
    Globals.showLoading();

    try {
      const data = {
        ...form,
        payment_method_id: parseInt(form.payment_method_id),
        funds_source_id: parseInt(form.funds_source_id),
        amount: parseFloat(parseFloat(form.amount / 100).toFixed(2)),
      };

      await OrdersService.create(data);
			const res = await AuthService.profile.get();
			this.props.dispatch({ type: 'SET_USER', payload: res.user.user });
      this.props.navigation.navigate('WithdrawalsSuccess');

    } catch (error) {
      console.log(error)
    }
    Globals.quitLoading();
  }

  render() {

    const { form } = this.state;

    return (
      <>
        <CustomHeader title="Retiros" />

        <ScreenContainer backgroundColor={Colors.background} verticalScroll={false}>
          <View style={{ marginHorizontal: 20 }}>
            <View style={{ marginTop: 20 }}>
              <Select
                style={{ backgroundColor: '#2A303C' }}
                placeholder="Forma de retiro"
                items={withdrawalMethods}
                value={form.payment_method_id}
                onValueChange={v => this.change(v, 'payment_method_id')}
              />
            </View>

            {!!form.payment_method_id && (
              <View style={{ marginTop: 20 }}>
                <Select
                  style={{ backgroundColor: '#2A303C' }}
                  placeholder="Origen de los fondos"
                  items={fundsSources}
                  value={form.funds_source_id}
                  onValueChange={v => this.change(v, 'funds_source_id')}
                />
              </View>
            )}

            {form.payment_method_id === Constants.WITHDRAWAL_METHOD.CASH && (
              <Text style={styles.cashFee}>Todos los retiros en efectivo tienen una{'\n'}comisión del 2%</Text>
            )}

            {!!form.funds_source_id && (
              <>
                <View style={{ marginTop: 30, marginBottom: 20 }}>
                  <Text style={styles.inputLabel}>Cantidad</Text>
                  <View style={[styles.input, styles.inputWrapper]}>
                    <TextInput
                      style={{ color: 'transparent', flex: 1, position: 'absolute', zIndex: 2, width: '100%', paddingRight: 80, textAlign: 'right' }}
                      value={form.amount}
                      onChangeText={e => this.change(Globals.getOnlyNumbers(e), 'amount')}
                      keyboardType="number-pad"
                    />
                    <Input
                      style={[styles.input, { backgroundColor: 'transparent', borderColor: 'transparent' }]}
                      inputStyle={{ ...styles.inputStyle, paddingRight: 0 }}
                      placeholder="0"
                      placeholderTextColor={Colors.gray3}
                      value={form.amount_formatted}
                      onChangeText={() => {}}
                      keyboardType="number-pad"
                    />
                    <Text style={styles.inputSuffix}>
                      { form.payment_method_id === Constants.WITHDRAWAL_METHOD.CASH ? 'Monto' : 'USDT' }
                    </Text>
                  </View>
                </View>
                {form.payment_method_id === Constants.ORDER.PAYMENT_METHOD.WALLET && (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={styles.inputLabel}>Wallet ( TRC 20 )</Text>
                    <Input
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      placeholderTextColor={Colors.gray3}
                      value={form.wallet}
                      onChangeText={e => this.change(e, 'wallet')}
                    />
                  </View>
                )}
                <TouchableOpacity style={styles.button} onPress={this.submit}>
                  <Text style={styles.buttonText}>Retirar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScreenContainer>
        <Menu />
      </>
    )
  }
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
	input: {
    flex: 1,
		backgroundColor: '#001929',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#001929',
    marginBottom: 0,
	},
	inputStyle: {
		paddingHorizontal: 10,
		color: Colors.white,
    textAlign: 'right',
	},
  inputSuffix: {
    width: 50,
    textAlign: 'left',
    fontSize: 14,
    color: '#687680',
  },
  cashFee: {
    fontSize: 14,
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

export default connect(state => ({
  user: state.user
}))(Withdrawals);