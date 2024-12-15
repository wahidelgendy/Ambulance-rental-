import { firebase } from '@nativescript/firebase';
import { Hospital } from '../../models/interfaces/hospital.interface';

export class AuthService {
  async loginHospital(email: string, password: string) {
    try {
      return await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async registerHospital(email: string, password: string, hospitalData: Partial<Hospital>) {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.firestore()
        .collection('hospitals')
        .doc(userCredential.user.uid)
        .set({
          ...hospitalData,
          id: userCredential.user.uid,
          registrationDate: new Date(),
          isVerified: false
        });
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}