import {
  DocumentData,
  QueryFieldFilterConstraint,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";

import { BaseModel } from "./model/baseModel";
import { Collections } from "./collections";
import { app } from "@/firebase-config";

const db = getFirestore(app);

async function getRealtime(
  currentCollection: Collections,
  onData: (data?: DocumentData) => void
) {
  try {
    onSnapshot(collection(db, currentCollection), (doc) =>
      onData(doc.docs.map((doc) => doc.data()))
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function get(currentCollection: Collections) {
  try {
    const snapshot = await getDocs(collection(db, currentCollection));
    const data = snapshot.docs.map((doc) => doc.data());
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getBy(id: string, currentCollection: Collections) {
  try {
    const docRef = doc(db, currentCollection, id);
    const snapshot = await getDoc(docRef);
    return snapshot.data();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function rawQuery(
  currentColletion: Collections,
  filter: QueryFieldFilterConstraint[],
  onData: (data?: DocumentData[]) => void
) {
  const q = query(collection(db, currentColletion), ...filter);

  try {
    onSnapshot(q, (querySnapshot) =>
      onData(querySnapshot.docs.map((doc) => doc.data()))
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function remove(id: string, currentCollection: Collections) {
  try {
    const docRef = doc(db, currentCollection, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function set<T extends BaseModel>(
  currentCollection: Collections,
  data: T
) {
  try {
    await setDoc(doc(db, currentCollection, data.id), data.toJson());
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const FirestoreHelper = {
  get,
  getBy,
  set,
  remove,
  getRealtime,
  rawQuery,
};
