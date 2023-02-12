import { PermissionsAndroid } from "react-native";

export const getStoragePermissions = async () => {
  try {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "App needs access to your storage to download Photos",
      }
    );
    return permission;
  } catch (err) {
    console.warn(err);
    return "denied";
  }
};
