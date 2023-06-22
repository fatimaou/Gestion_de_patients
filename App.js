import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

 

// Importez vos pages (composants React)
import Login from './app/pages/loginscreen'
import DocteurPage from './app/pages/Doctor';
import AdministrateurPage from './app/pages/Admin';
import RHPage from './app/pages/RH';

 

const Stack = createStackNavigator();

 

export default function App() {
  return (
<NavigationContainer>
<Stack.Navigator initialRouteName="Login" component={Login}> 
 <Stack.Screen name="Docteur" component={DocteurPage} />
<Stack.Screen name="Administrateur" component={AdministrateurPage} />
<Stack.Screen name="RH" component={RHPage} /> 
{/* <Stack.Screen name="Doctor" component={Doctor} options={{ title: 'Page Médecin' }}/>
<Stack.Screen name="PatientModify" component={PatientModify} options={{ title: 'Liste des patients' }}/> */}
</Stack.Navigator>
</NavigationContainer>
  );
}