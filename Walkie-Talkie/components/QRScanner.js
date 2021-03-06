import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { BarCodeScanner } from "expo-barcode-scanner";

import BarcodeMask from "react-native-barcode-mask";

const finderWidth = 280;

const finderHeight = 230;

const width = Dimensions.get("window").width;

const height = Dimensions.get("window").height;

const viewMinX = (width - finderWidth) / 2;

const viewMinY = (height - finderHeight) / 2;

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(BarCodeScanner.Constants.Type.back);
  const [scanned, setScanned] = useState(false);
  const [showScan, setShowScan] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = (scanningResult) => {
    if (!scanned) {
      const { type, data, bounds: { origin } = {} } = scanningResult;

      const { x, y } = origin;

      if (
        x >= viewMinX &&
        y >= viewMinY &&
        x <= viewMinX + finderWidth / 2 &&
        y <= viewMinY + finderHeight / 2
      ) {
        setScanned(true);
        setShowScan(false);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      }
    }
  };

  if (hasPermission === null) {
    return <ActivityIndicator size="large" />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={false} style="light" />
      {/* <View>
        <Text
          style={{
            fontSize: 25,
            color: "white",
            padding: 15,
            backgroundColor: "black",
          }}
        >
          QR Scanner
        </Text>
      </View> */}
      {showScan ? (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          type={type}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={[StyleSheet.absoluteFillObject, styles.container]}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}
              onPress={() => {
                setType(
                  type === BarCodeScanner.Constants.Type.back
                    ? BarCodeScanner.Constants.Type.front
                    : BarCodeScanner.Constants.Type.back
                );
              }}
            >
              <Text style={{ fontSize: 18, margin: 5, color: "white" }}>
                {" "}
                Flip{" "}
              </Text>
            </TouchableOpacity>
          </View>
          <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />
          <Button
            title="Stop Scan"
            onPress={() => {
              setShowScan(false);
            }}
          />
        </BarCodeScanner>
      ) : (
        <View>
          <Button
            title="Scan Again"
            onPress={() => {
              setScanned(false);
              setShowScan(true);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  title: {
    fontSize: 20,

    fontWeight: "bold",
  },

  separator: {
    marginVertical: 30,

    height: 1,

    width: "80%",
  },
});
