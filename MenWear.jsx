import React, { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export default function MenWear() {
  const [menWearListings, setMenWearListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenWearListings() {
      try {
        const menWearRef = collection(db, "products");
        const q = query(
          menWearRef,
          where("category", "==", "Men"), // Adjust the field and value based on your data model
          orderBy("timestamp"),
        );
        const querySnap = await getDocs(q);
        const menWearListings = [];
        querySnap.forEach((doc) => {
          menWearListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setMenWearListings(menWearListings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Men's wear listings:", error);
      }
    }

    fetchMenWearListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Men's Wear</h1>
      {loading ? (
        <p>Loading...</p>
      ) : menWearListings && menWearListings.length > 0 ? (
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {menWearListings.map((listing) => (
            <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
          ))}
        </ul>
      ) : (
        <p>No Men's wear products available.</p>
      )}
    </div>
  );
}
