import { useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { NavigationContainer, type Theme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { palette } from './src/theme/tokens';

const navigationTheme: Theme = {
  dark: true,
  colors: {
    primary: palette.accentStrong,
    background: palette.background,
    card: palette.backgroundElevated,
    text: palette.textPrimary,
    border: palette.surfaceOutline,
    notification: palette.warning,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '800',
    },
  },
};

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colorScheme === 'light' ? palette.backgroundDeep : palette.background);
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <LinearGradient
          colors={[palette.backgroundDeep, palette.gradientStart, palette.gradientEnd]}
          end={{ x: 0.85, y: 0.08 }}
          start={{ x: 0.05, y: 0.92 }}
          style={StyleSheet.absoluteFill}
        />
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
});
