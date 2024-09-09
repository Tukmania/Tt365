import React, { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export default function Kids() {
  const [kidsListings, setKidsListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKidsListings() {
      try {
        const ladiesRef = collection(db, "products");
        const q = query(
          ladiesRef,
          where("category", "==", "Kids"), // Adjust the field and value based on your data model
          orderBy("timestamp"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        const kidsListings = [];
        querySnap.forEach((doc) => {
          kidsListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setKidsListings(kidsListings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching kids listings:", error);
      }
    }

    fetchKidsListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Ladies Wear</h1>
      {loading ? (
        <p>Loading...</p>
      ) : kidsListings && kidsListings.length > 0 ? (
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {kidsListings.map((listing) => (
            <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
          ))}
        </ul>
      ) : (
        <p>No kids wear products available.</p>
      )}
    </div>
  );
}
