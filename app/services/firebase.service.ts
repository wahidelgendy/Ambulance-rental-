import { firebase } from '@nativescript/firebase';

export class FirebaseService {
  async initializeFirebase() {
    await firebase.init({
      // Firebase configuration will go here
    });
  }

  // Authentication methods
  async loginHospital(email: string, password: string) {
    return await firebase.auth().signInWithEmailAndPassword(email, password);
  }

  async registerHospital(email: string, password: string, hospitalData: any) {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await firebase.firestore().collection('hospitals').doc(userCredential.user.uid).set(hospitalData);
    return userCredential;
  }

  // Firestore methods
  async createRide(rideData: any) {
    return await firebase.firestore().collection('rides').add(rideData);
  }

  async updateAmbulanceLocation(ambulanceId: string, location: any) {
    return await firebase.firestore().collection('ambulances').doc(ambulanceId).update({
      location: location
    });
  }

  // Real-time listeners
  onRideStatusChange(rideId: string, callback: (data: any) => void) {
    return firebase.firestore()
      .collection('rides')
      .doc(rideId)
      .onSnapshot(callback);
  }
}