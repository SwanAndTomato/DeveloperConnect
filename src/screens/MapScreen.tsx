import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Alert, PermissionsAndroid, Platform, Image, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import users from '../data/usersdb';

type MapScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Map'
>;

type Props = {
    navigation: MapScreenNavigationProp;
    route: { params: { username: string } };
};

const MapScreen: React.FC<Props> = ({ navigation, route }) => {
    const [currentPosition, setCurrentPosition] = useState<{ latitude: number; longitude: number } | null>(null);
    const [initialRegion, setInitialRegion] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 5,
        longitudeDelta: 5,
    });
    const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
    const { username } = route.params;

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                getCurrentLocation();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: "Location Access Required",
                            message: "This app needs to access your location",
                            buttonPositive: "OK",
                            buttonNegative: "Cancel",
                            buttonNeutral: "Ask Me Later"
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getCurrentLocation();
                    } else {
                        useDefaultLocation();
                    }
                } catch (err) {
                    console.warn(err);
                    useDefaultLocation();
                }
            }
        };

        const getCurrentLocation = async () => {
            try {
                const position = await GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 15000,
                });
                const { latitude, longitude } = position;
                setCurrentPosition({ latitude, longitude });
                setInitialRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            } catch (error) {
                console.log(error);
                useDefaultLocation();
            }
        };

        const useDefaultLocation = () => {
            Alert.alert("Error", "Unable to get current location. Using default location.");
            const defaultLatitude = 52.1951; // Cambridge, UK
            const defaultLongitude = 0.1313;
            setCurrentPosition({ latitude: defaultLatitude, longitude: defaultLongitude });
            setInitialRegion({
                latitude: defaultLatitude,
                longitude: defaultLongitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        };

        const fetchGitHubAvatar = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setCurrentUserAvatar(data.avatar_url);
                } else {
                    console.error('Failed to fetch avatar');
                    setCurrentUserAvatar(null);
                }
            } catch (error) {
                console.error(error);
                setCurrentUserAvatar(null);
            }
        };

        requestLocationPermission();
        fetchGitHubAvatar();
    }, [username]);

    const handleMarkerPress = (username: string) => {
        navigation.navigate('Profile', { username });
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
            >
                {users.map(user => (
                    <Marker
                        key={user.id}
                        coordinate={{ latitude: user.latitude, longitude: user.longitude }}
                        onPress={() => handleMarkerPress(user.username)}
                    >
                        <Image
                            source={{ uri: user.avatarUrl }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                                <Image
                                    source={{ uri: user.avatarUrl }}
                                    style={styles.calloutImage}
                                />
                                <View style={styles.calloutTextContainer}>
                                    <Text style={styles.calloutText}>{user.name}</Text>
                                    <Text style={styles.calloutText}>{user.description}</Text>
                                </View>
                            </View>
                        </Callout>
                    </Marker>
                ))}
                {currentPosition && currentUserAvatar && (
                    <Marker
                        coordinate={{ latitude: currentPosition.latitude, longitude: currentPosition.longitude }}
                        onPress={() => handleMarkerPress(username)}
                    >
                        <Image
                            source={{ uri: currentUserAvatar }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                                <Image
                                    source={{ uri: currentUserAvatar }}
                                    style={styles.calloutImage}
                                />
                                <View style={styles.calloutTextContainer}>
                                    <Text style={styles.calloutText}>{username}</Text>
                                    <Text style={styles.calloutText}>Current Location</Text>
                                </View>
                            </View>
                        </Callout>
                    </Marker>
                )}
            </MapView>
            <Button title="Logout" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    calloutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        width: 'auto',
        maxWidth: 250,
    },
    calloutImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 5,
    },
    calloutTextContainer: {
        width: 150,
        height: 45,
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 7,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3
    },
    calloutText: {
        flexShrink: 1,
    },
});

export default MapScreen;
