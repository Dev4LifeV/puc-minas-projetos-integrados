export const auth = {
  onAuthStateChanged: jest.fn(),
  beforeAuthStateChanged: jest.fn(),
  currentUser: null,
};

export const googleProvider = {};

export const app = {
  name: "[DEFAULT]",
  options: {},
};

export const getFirestore = jest.fn();
