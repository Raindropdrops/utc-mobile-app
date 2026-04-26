import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '../components/AppIcon';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SyncScreen } from '../screens/SyncScreen';
import { palette, radii, spacing, typography } from '../theme/tokens';
import { ScheduleStackNavigator } from './ScheduleStackNavigator';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabIconMap: Record<keyof RootTabParamList, 'calendar' | 'clock' | 'gear'> = {
  ScheduleStack: 'calendar',
  Sync: 'clock',
  Settings: 'gear',
};

const tabLabelMap: Record<keyof RootTabParamList, string> = {
  ScheduleStack: 'Lịch học',
  Sync: 'Đồng bộ',
  Settings: 'Cài đặt',
};

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="ScheduleStack"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: palette.accentStrong,
        tabBarInactiveTintColor: palette.textTertiary,
        tabBarStyle: {
          position: 'absolute',
          left: spacing.lg,
          right: spacing.lg,
          bottom: Math.max(insets.bottom, spacing.sm),
          height: 64 + Math.max(insets.bottom, spacing.xs),
          paddingTop: spacing.xs,
          paddingBottom: Math.max(insets.bottom, spacing.xs),
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: radii.xxl,
          backgroundColor: palette.overlay,
        },
        tabBarItemStyle: {
          borderRadius: radii.lg,
          marginHorizontal: spacing.xxs,
        },
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: '600',
          marginTop: spacing.xxs,
        },
        tabBarIconStyle: {
          marginTop: spacing.xxs,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconName = tabIconMap[route.name as keyof RootTabParamList];
          const iconSize = focused ? size + 1 : size;
          return <AppIcon color={color} name={iconName} size={iconSize} />;
        },
        tabBarButtonTestID: `tab-${route.name.toLowerCase()}`,
        tabBarAccessibilityLabel: `tab-${route.name.toLowerCase()}`,
        tabBarAllowFontScaling: false,
        tabBarBackground: () => null,
      })}
    >
      <Tab.Screen
        component={ScheduleStackNavigator}
        name="ScheduleStack"
        options={{
          title: tabLabelMap.ScheduleStack,
        }}
      />
      <Tab.Screen
        component={SyncScreen}
        name="Sync"
        options={{
          title: tabLabelMap.Sync,
        }}
      />
      <Tab.Screen
        component={SettingsScreen}
        name="Settings"
        options={{
          title: tabLabelMap.Settings,
        }}
      />
    </Tab.Navigator>
  );
};
