import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ScheduleScreen } from '../screens/ScheduleScreen';
import { palette } from '../theme/tokens';
import type { ScheduleStackParamList } from './types';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export const ScheduleStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: palette.background },
      }}
    >
      <Stack.Screen component={ScheduleScreen} name="ScheduleHome" />
    </Stack.Navigator>
  );
};
