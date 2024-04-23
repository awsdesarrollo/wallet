import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Modal, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { CalendarIcon } from '#/assets/icons';
import { Colors, Fonts } from '../utils';

const ITEM_HEIGHT = 44;
const HEIGHT = 300;
const MINUTES_INTERVAL = 5;
const AM = 'am';
const PM = 'pm';

function generateRange(min = 0, max = 24) {
	const result = [];
	for (let i = min; i < max; i++) {
		result.push(i);
	}
	return result;
}

function minuteToInteval(minute) {
	return String(Math.ceil(minute / MINUTES_INTERVAL) * MINUTES_INTERVAL).padStart(2,'0');
}

function getMinTime(minTime = null) {
	let _minHours24 = 0;
	let _minHours12 = 1;
	let _minMinutes = 0;
	let _isAMAvailable = true;

	if (minTime && moment(minTime).isValid()) {
		_minHours24 = moment(minTime).format('HH');
		_minHours12 = moment(minTime).format('hh');
		_minMinutes = moment(minTime).format('mm');
		_minMinutes = minuteToInteval(_minMinutes);

		if (_minMinutes == 60) {
			_minHours24 = moment(minTime).add(1,'hour').format('HH');
			_minHours12 = moment(minTime).add(1,'hour').format('hh');
			_minMinutes = '00';
		}

		_isAMAvailable = _minHours24 < 12;
	}

	return {
		minHours24: _minHours24,
		minHours12: _minHours12,
		minMinutes: _minMinutes,
		isAMAvailable: _isAMAvailable,
	}
}

function getScrollItems(selectedTime, minDateTime, isHour12) {
	const { minHours24, minHours12, minMinutes, isAMAvailable } = getMinTime(minDateTime);

	const MERIDIEM = [];
	if (isAMAvailable) MERIDIEM.push(AM);
	MERIDIEM.push(PM);

	const isSameMeridiem = isHour12 ? selectedTime.meridiem === MERIDIEM[0] : false;
	const hours24Range = generateRange(minHours24, 24);
	let hours12Range = generateRange(isSameMeridiem ? minHours12 - 1 : 0, 12);

	const isSameHour = Number(isHour12 ? hours12Range[0] + 1 : hours24Range[0]) === Number(selectedTime.hour);
	const minMinute = isSameMeridiem && isSameHour ? (minMinutes / MINUTES_INTERVAL) : 0;
	const minutesRange = generateRange(minMinute, 60 / MINUTES_INTERVAL);

	if (hours12Range.length === 1) hours12Range = generateRange(0, 12);
	const HOURS24 = hours24Range.map(x => String(x).padStart(2,'0'));
	const HOURS12 = hours12Range.map(x => String(Number(x) + 1).padStart(2,'0'));

	const MINUTES = minutesRange.map(x => String(Number(x) * MINUTES_INTERVAL).padStart(2,'0'));

	if (!MINUTES.length) {
		const timeInFormat = isHour12
			? `hh:mm ${selectedTime.meridiem}`
			: 'HH:mm';

		const hour = moment(selectedTime.hour, timeInFormat)
			.add(1, 'hour')
			.format(isHour12 ? 'hh':'HH');

		const timeWithNextHour = { ...selectedTime, hour };
		return getScrollItems(timeWithNextHour, minDateTime, isHour12);
	}

	return {
		HOURS24,
		HOURS12,
		MINUTES,
		MERIDIEM,
	}
}

const _TimePicker = (props) => {

	const isHour12 = props?.isHour12 ?? true;
	const [showModal, setShowModal] = useState(false);
	const minTime = moment(props?.minTime || null).isValid() ? moment(props.minTime) : undefined;
	const valueFormat = 'HH:mm';
	const displayFormat = props.format || (isHour12 ? 'hh:mm a' : 'HH:mm');
	const placeholder = props.placeholder || 'Seleccione';

	const value = (!!props.value && moment(props.value, valueFormat).isValid())
		? props.value
		: undefined;

	const displayValue = moment(props.value, valueFormat).isValid()
		? moment(value).format(displayFormat)
		: '';

	const onChangeValue = (value) => {
		props.onValueChange(value);
		setShowModal(false);
	}

	return (
		<>
			<Modal
				visible={showModal}
				onRequestClose={() => setShowModal(false)}
				transparent
			>
				<TouchableOpacity
					style={modalStyle.backdrop}
					onPress={() => setShowModal(false)}
					activeOpacity={1}
				/>
				<TimePickerModal
					isHour12={props?.isHour12 ?? true}
					minTime={minTime}
					currentTime={value}
					onChangeTime={onChangeValue}
					onClose={() => setShowModal(false)}
				/>
			</Modal>

			<View style={[ styles.container, props.style || {} ]}>
				<TouchableOpacity
					style={[ styles.input, props.inputStyle || {} ]}
					onPress={() => props?.disabled ? {} : setShowModal(true)}
				>
					<Image source={props.icon || CalendarIcon} style={[styles.icon, props.iconStyle]} />
					<View style={[ styles.inputText, props.inputTextStyle || {} ]}>
						{!!displayValue ? (
							isHour12 ? (
								<View style={styles.rowMeridiem}>
									<Text style={{ fontSize: 14, lineHeight: 16 }}>
										{ String(displayValue).split(' ')[0] }
									</Text>
									<Text style={styles.highlightMeridiem}>
										{ String(displayValue).split(' ')[1] }
									</Text>
								</View>
							) : (
								<Text style={[ styles.date, props.dateStyle || {} ]}>
									{ displayValue }
								</Text>
							)
						) : (
							<Text style={[ styles.placeholder, props.placeholderStyle || {} ]}>{ placeholder }</Text>
						)}
					</View>
				</TouchableOpacity>
			</View>
		</>
	)
}

const TimePickerModal = ({ currentTime, onClose, minTime, isHour12 = true, onChangeTime }) => {
	const [timeLabel, setTimeLabel] = useState({
		hour: '12',
		minute: '00',
		meridiem: 'am',
		isTimeChanged: false,
	});

	const { minHours24, minMinutes } = getMinTime(minTime);
	const { HOURS12, HOURS24, MINUTES, MERIDIEM } = getScrollItems(timeLabel, minTime, isHour12);

	const formatDefaultTime = () => {
		let initialTime = currentTime;
		if (timeLabel.isTimeChanged) {
			const _meridiem = isHour12 ? ' ' + timeLabel.meridiem : '';
			const dateInput = `${timeLabel.hour}${timeLabel.minute}${_meridiem}`;
			const dateFormat = isHour12 ? 'hh:mm a' : 'HH:mm';
			initialTime = moment(dateInput, dateFormat).toDate();
		}

		const time = moment(initialTime).isValid()
			? getDefaultTime(moment(initialTime).format('HH:mm'))
			: getDefaultTime();

		const [ hour, minute ] = time.split(':');
		const meridiemWord = Number(hour) >= 12 ? PM : AM;

		setTimeLabel({
			hour: moment(time, 'HH:mm').format(isHour12 ? 'hh':'HH'),
			minute,
			// meridiem: timeLabel.isTimeChanged ? timeLabel.meridiem : meridiemWord,
			meridiem: meridiemWord,
			isTimeChanged: true,
		});
	}

	const getDefaultTime = (time = '12:00') => {
		let defaultHour = time.split(':')[0];
		let defaultMinute = minuteToInteval(time.split(':')[1]);

		if (defaultMinute == 60) {
			defaultHour = moment(time, 'HH:mm').add(1,'hour').format('HH');
			defaultMinute = '00';
		}

		if (minHours24 > defaultHour) defaultHour = minHours24;
		if (minMinutes > defaultMinute) defaultMinute = minMinutes;

		return `${String(defaultHour).padStart(2,'0')}:${String(defaultMinute).padStart(2,'0')}`;
	}

  const onHourChange = useCallback(({ label }) => {
		setTimeLabel(state => ({ ...state, hour: label }));
	},[]);

  const onMinuteChange = useCallback(({ label }) => {
		setTimeLabel(state => ({ ...state, minute: label }));
	},[]);

  const onMeridiemChange = useCallback(({ label }) => {
		setTimeLabel(state => ({ ...state, meridiem: label }));
	},[]);

	const submit = () => {
		let timeOutput = `${timeLabel.hour}:${minuteToInteval(timeLabel.minute)}`;

		if (isHour12) {
			if (timeLabel.meridiem === AM) {
				timeOutput = timeLabel.hour === '12'
					? moment(timeOutput, 'hh:mm').subtract(12,'hour').format('HH:mm')
					: moment(timeOutput, 'hh:mm').format('HH:mm');

			} else {
				timeOutput = timeLabel.hour === '12'
					? moment(timeOutput, 'hh:mm').format('HH:mm')
					: moment(timeOutput, 'hh:mm').add(12,'hour').format('HH:mm');
			}
		}

		onChangeTime(timeOutput);
	}

	useEffect(() => {
		formatDefaultTime();
	}, [currentTime, minTime, timeLabel.meridiem]);

	return (
		<View style={modalStyle.container}>
			<View style={modalStyle.content}>
				<View style={modalStyle.time}>
					<ScrollableItem
						options={isHour12 ? HOURS12 : HOURS24}
						onItemIndexChange={onHourChange}
						selectedLabel={timeLabel.hour}
					/>

					<ScrollableItem
						options={MINUTES}
						onItemIndexChange={onMinuteChange}
						selectedLabel={timeLabel.minute}
					/>

					{isHour12 && (
						<ScrollableItem
							options={MERIDIEM}
							onItemIndexChange={onMeridiemChange}
							selectedLabel={timeLabel.meridiem}
						/>
					)}
				</View>

				<View style={modalStyle.actions}>
					<TouchableOpacity style={modalStyle.button} onPress={() => onClose()}>
						<Text style={modalStyle.buttonText}>Cancelar</Text>
					</TouchableOpacity>

					<View style={modalStyle.buttonSeparator} />

					<TouchableOpacity style={modalStyle.button} onPress={() => submit()}>
						<Text style={modalStyle.buttonText}>Aceptar</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const ScrollableItem = ({ options, selectedLabel, onItemIndexChange }) => {

	const listRef = useRef();

	let scrollIndex = !!options.length
		? options.findIndex(x => x === selectedLabel)
		: 0;

	useEffect(() => {
		listRef.current.scrollToIndex({
			index: scrollIndex >= 0 ? scrollIndex : 0,
			animated: false,
		})
	}, [options, selectedLabel]);

	return (
		<View style={sIStyle.container}>
			<View style={sIStyle.selectedTime} />

			<FlatList
				ref={listRef}
				initialScrollIndex={0}
				data={options}
				style={{ width: '100%' }}
				keyExtractor={(_, index) => `${index}`}
				bounces={false}
				scrollEventThrottle={16}
				decelerationRate='fast'
				snapToInterval={ITEM_HEIGHT}
				showsVerticalScrollIndicator={false}
				renderToHardwareTextureAndroid
				contentContainerStyle={sIStyle.contentContainer}
				renderItem={({ item }) => <Item item={item} />}
				getItemLayout={(_, index) => ({
					length: ITEM_HEIGHT,
					offset: ITEM_HEIGHT * index,
					index,
				})}
				onMomentumScrollEnd={(ev) => {
					const index = Math.round(ev.nativeEvent.contentOffset.y / ITEM_HEIGHT);
					onItemIndexChange({
						label: options[index]?.label || options[index],
						index,
					});
				}}
			/>
		</View>
	);
};

const Item = React.memo(({ item }) => {
  return (
    <View style={modalStyle.itemWrapper}>
			<Text style={modalStyle.itemText}>
				{ isNaN(item?.label) ? item : String(item?.label).padStart(2,'0') }
			</Text>
    </View>
  );
});

const sIStyle = StyleSheet.create({
	container: {
		position: 'relative',
		display: 'flex',
		flex: 1,
	},
	contentContainer: {
		paddingTop: HEIGHT / 2 - ITEM_HEIGHT / 2,
		paddingBottom: HEIGHT / 2 - ITEM_HEIGHT / 2,
		paddingHorizontal: 10,
	},
	selectedTime: {
		width: '100%',
		height: ITEM_HEIGHT,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: 'blue',
		position: 'absolute',
		backgroundColor: '#FFFFFF',
		alignSelf: 'center',
		top: HEIGHT / 2 - ITEM_HEIGHT / 2,
	},
});

const modalStyle = StyleSheet.create({
	backdrop: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		backgroundColor: '#00000066',
	},
	container: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		backgroundColor: Colors.grayBackground,
		borderRadius: 4,
		elevation: 2,
		overflow: 'hidden',
	},
	time: {
		height: 300,
		width: 240,
		overflow: 'hidden',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ITEM_HEIGHT,
  },
  itemText: {
    fontSize: 26,
    fontWeight: '800',
		color: Colors.gray3,
		textAlign: 'center',
		width: '100%',
  },
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		borderTopWidth: 1 / PixelRatio.get(),
		borderTopColor: Colors.gray3,
	},
	button: {
		flex: 1,
		height: ITEM_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 12,
	},
	buttonSeparator: {
		width: 1 / PixelRatio.get(),
		height: ITEM_HEIGHT,
		backgroundColor: Colors.gray3,
	},
});

const styles = StyleSheet.create({
	container: {
		borderRadius: 5,
		height: 38,
		flexDirection: 'row',
		overflow: 'hidden',
	},
	input: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputText: {
		flex: 1,
		marginLeft: 10,
	},
	rowMeridiem: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	highlightMeridiem: {
		fontFamily: Fonts.SEMIBOLD,
		fontSize: 14,
		lineHeight: 16,
		color: Colors.blue,
		flex: 1,
		textAlign: 'center',
	},
	icon: {
		width: 20,
		height: 20,
		marginHorizontal: 5,
		tintColor: Colors.gray2,
	},
	date: {
		color: Colors.gray3,
	},
	placeholder: {
		color: Colors.gray2,
	},
});

export default _TimePicker