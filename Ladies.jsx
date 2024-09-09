import React, { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export default function Ladies() {
  const [ladiesListings, setLadiesListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLadiesListings() {
      try {
        const ladiesRef = collection(db, "products");
        const q = query(
          ladiesRef,
          where("category", "==", "Ladies"), // Adjust the field and value based on your data model
          orderBy("timestamp"),
        
        );
        const querySnap = await getDocs(q);
        const ladiesListings = [];
        querySnap.forEach((doc) => {
          ladiesListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setLadiesListings(ladiesListings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Ladies listings:", error);
      }
    }

    fetchLadiesListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Ladies Wear</h1>
      {loading ? (
        <p>Loading...</p>
      ) : ladiesListings && ladiesListings.length > 0 ? (
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {ladiesListings.map((listing) => (
            <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
          ))}
        </ul>
      ) : (
        <p>No Ladies wear products available.</p>
      )}
    </div>
  );
}
