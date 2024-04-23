import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BottomIcon, DownloadIcon } from '../assets/icons';
import FastImage from '../components/fast-image';
import { Colors, DownloadFile } from '../utils';

class FullscreenImage extends Component {

  state = {
    selected: this.props.route.params.selected || 0,
    images: this.props.route.params.images || [],
  }

  componentDidMount() {
    this.props.navigation.setParams({
      containerStyle: {
        backgroundColor: '#000000',
      },
      iconStyle: {
        tintColor: '#ffffff',
      },
      right: (
        <TouchableOpacity onPress={this.downloadImage}>
          <Image source={DownloadIcon} style={styles.downloadIcon} />
        </TouchableOpacity>
      ),
    });
  }

  downloadImage = () => {
    DownloadFile.download(this.state.images[this.state.selected]);
  }

  handleLeftPress = () => {
    const { selected } = this.state;
    if (selected > 0) {
      this.setState({ selected: selected - 1 });
    }
  }

  handleRightPress = () => {
    const { selected, images } = this.state;
    if (selected < images.length - 1) {
      this.setState({ selected: selected + 1 });
    }
  }

  render() {
    const { selected, images } = this.state;
    const isFirst = selected === 0;
    const isLast = selected === images.length - 1;

    return (
      <View style={styles.container}>
        {!isFirst && (
          <TouchableOpacity
            onPress={this.handleLeftPress}
            style={styles.leftControl}
          >
            <Image source={BottomIcon} style={styles.leftControlIcon} />
          </TouchableOpacity>
        )}

        <FastImage source={{ uri: images[selected] }} style={styles.image} />

        {!isLast && (
          <TouchableOpacity
            onPress={this.handleRightPress}
            style={styles.rightControl}
          >
            <Image source={BottomIcon} style={styles.rightControlIcon} />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  downloadIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  leftControl: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    top: '50%',
    bottom: 0,
    left: 10,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  leftControlIcon: {
    width: 24,
    height: 24,
    left: -2,
    resizeMode: 'contain',
    tintColor: '#ffffff',
    opacity: 0.75,
    transform: [{ rotate: '90deg' }],
  },
  rightControl: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    top: '50%',
    bottom: 0,
    right: 10,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  rightControlIcon: {
    width: 24,
    height: 24,
    left: 2,
    resizeMode: 'contain',
    tintColor: '#ffffff',
    opacity: 0.75,
    transform: [{ rotate: '-90deg' }],
  },
  controlText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
});

export default FullscreenImage