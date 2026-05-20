const firebaseConfig = {
  apiKey: 'AIzaSyDt-B8Uz_LDUAHa26DeufwdDSu4Im_9wJI',
  authDomain: 'appmeta-731da.firebaseapp.com',
  projectId: 'appmeta-731da',
  storageBucket: 'appmeta-731da.appspot.com',
  messagingSenderId: '557112866155',
  appId: '1:557112866155:web:2d289b4babc8630ad4482e',
  measurementId: 'G-PCST06GCB2'
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);

// LOGIN
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await firebase.signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html';
  } catch (e) {
    alert('Error: ' + e.message);
  }
}
