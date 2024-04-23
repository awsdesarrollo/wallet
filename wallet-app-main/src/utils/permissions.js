import Permissions from "react-native-permissions";

class PermissionController {
  async check(permission) {
    let response = await Permissions.check(permission);
    if (response == "granted" || response == "authorized") {
      return {
        result: true
      };
    } else {
      return {
        result: false
      };
    }
  }

  async request(permission) {
    let response = await Permissions.request(permission)
    if (response == "granted" || response == "authorized") {
      return {
        result: true
      };
    } else {
      return {
        result: false
      };
    }
  }
}

export default new PermissionController();
