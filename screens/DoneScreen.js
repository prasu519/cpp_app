import React from "react";
import { View, Modal, Text } from "react-native";
import LottieView from "lottie-react-native";
import * as Progress from "react-native-progress";

function DoneScreen({ onDone, progress = 0, visible = true }) {
  return (
    <Modal visible={visible}>
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {progress < 1 ? (
          <Progress.Bar color="red" progress={progress} width={200} />
        ) : (
          <LottieView
            style={{ flex: 1, width: 200, height: 200 }}
            autoPlay
            loop={false}
            onAnimationFinish={onDone}
            source={require("../assets/animations/done.json")}
          />
        )}
      </View>
    </Modal>
  );
}

export default DoneScreen;
