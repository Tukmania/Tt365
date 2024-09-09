import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export default function Home() {
  const [trendingListings, setTrendingListings] = useState(null);
  const [menListings, setMenListings] = useState(null);
  const [ladiesListings, setLadiesListings] = useState(null);
  const [kidsListings, setKidsListings] = useState(null);
  const [trainersListings, setTrainersListings] = useState(null);

  useEffect(() => {
    async function fetchListings(category, setListings) {
      try {
        const listingsRef = collection(db, "products");
        const q = query(
          listingsRef,
          where("category", "==", category),
          orderBy("timestamp"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
      } catch (error) {
        console.error(error);
      }
    }

    // Fetch Trending listings
    fetchListings("Trending", setTrendingListings);

    // Fetch Men's listings
    fetchListings("Men", setMenListings);

    // Fetch Ladies listings
    fetchListings("Ladies", setLadiesListings);

    // Fetch Kids listings
    fetchListings("Kids", setKidsListings);

    // Fetch Trainers listings
    fetchListings("Trainers", setTrainersListings);
  }, []);

  const renderCategorySection = (listings, category, route) => (
    <>
      {listings && listings.length > 0 && (
        <div className="m-2 mb-6">
          <h2 className="px-3 text-2xl mt-6 font-semibold">{category} Products</h2>
          <Link to={`/category/${route}`}>
            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
              Show more {category} Products
            </p>
          </Link>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
            ))}
          </ul>
        </div>
      )}
    </>
  );

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {renderCategorySection(trendingListings, "Trending", "trending")}
        {renderCategorySection(menListings, "Men's", "men")}
        {renderCategorySection(ladiesListings, "Ladies", "ladies")}
        {renderCategorySection(kidsListings, "Kids", "kids")}
        {renderCategorySection(trainersListings, "Trainers", "trainers")}
      </div>
    </div>
  );
}




// import {
//   collection,
//   getDoc,
//   getDocs,
//   limit,
//   orderBy,
//   query,
//   where,
// } from "firebase/firestore";
// import { useEffect } from "react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import ListingItem from "../components/ListingItem";
// import Slider from "../components/Slider";
// import { db } from "../firebase";

// export default function Home() {
//   // Offers
//   const [offerListings, setOfferListings] = useState(null);
//   useEffect(() => {
//     async function fetchListings() {
//       try {
//         // get reference
//         const listingsRef = collection(db, "products");
//         // create the query
//         const q = query(
//           listingsRef,
//           where("category", "==", "Men"),

//           limit(4)
//         );
//         // execute the query
//         const querySnap = await getDocs(q);
//         const listings = [];
//         querySnap.forEach((doc) => {
//           return listings.push({
//             id: doc.id,
//             data: doc.data(),
//           });
//         });
//         setOfferListings(listings);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchListings();
//   }, []);
//   // Places for rent
//   const [rentListings, setRentListings] = useState(null);
//   useEffect(() => {
//     async function fetchListings() {
//       try {
//         // get reference
//         const listingsRef = collection(db, "products");
//         // create the query
//         const q = query(
//           listingsRef,
//           where("type", "==", "Trending"),
//           orderBy("category", "description"),
//           limit(4)
//         );
//         // execute the query
//         const querySnap = await getDocs(q);
//         const listings = [];
//         querySnap.forEach((doc) => {
//           return listings.push({
//             id: doc.id,
//             data: doc.data(),
//           });
//         });
//         setRentListings(listings);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchListings();
//   }, []);
//   // Places for sale
//   const [saleListings, setSaleListings] = useState(null);
//   useEffect(() => {
//     async function fetchListings() {
//       try {
//         // get reference
//         const listingsRef = collection(db, "products");
//         // create the query
//         const q = query(
//           listingsRef,
//           where("category", "==", "Men"),
//           orderBy("timestamp", "description"),
//           limit(4)
//         );
//         // execute the query
//         const querySnap = await getDocs(q);
//         const listings = [];
//         querySnap.forEach((doc) => {
//           return listings.push({
//             id: doc.id,
//             data: doc.data(),
//           });
//         });
//         setSaleListings(listings);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchListings();
//   }, []);

//   // Offices for rent
//   const [officeListings, setOfficeListings] = useState(null);
//   useEffect(() => {
//     async function fetchListings() {
//       try {
//         // get reference
//         const listingsRef = collection(db, "products");
//         // create the query
//         const q = query(
//           listingsRef,
//           where("category", "==", "Ladies"),
//           orderBy("timestamp", "description"),
//           limit(4)
//         );
//         // execute the query
//         const querySnap = await getDocs(q);
//         const listings = [];
//         querySnap.forEach((doc) => {
//           return listings.push({
//             id: doc.id,
//             data: doc.data(),
//           });
//         });
//         setOfficeListings(listings);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchListings();
//   }, []);


//   // Offices for rent
//   const [propertyListings, setPropertyListings] = useState(null);
//   useEffect(() => {
//     async function fetchListings() {
//       try {
//         // get reference
//         const listingsRef = collection(db, "products");
//         // create the query
//         const q = query(
//           listingsRef,
//           where("category", "==", "Kids"),
//           orderBy("timestamp", "desc"),
//           limit(4)
//         );
//         // execute the query
//         const querySnap = await getDocs(q);
//         const listings = [];
//         querySnap.forEach((doc) => {
//           return listings.push({
//             id: doc.id,
//             data: doc.data(),
//           });
//         });
//         setPropertyListings(listings);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchListings();
//   }, []);

//   return (
//     <div>

// <div className="container px-5 mx-auto mt-3">
      
//     </div>
//       <Slider />
//       <div className="max-w-6xl mx-auto pt-4 space-y-6">
//         {offerListings && offerListings.length > 0 && (
//           <div className="m-2 mb-6">
//             <h2 className="px-3 text-2xl mt-6 font-semibold">Recent offers</h2>
//             <Link to="/offers">
//               <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
//                 Show more offers
//               </p>
//             </Link>
//             <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
//               {offerListings.map((listing) => (
//                 <ListingItem
//                   key={listing.id}
//                   listing={listing.data}
//                   id={listing.id}
//                 />
//               ))}
//             </ul>
//           </div>
//         )}
//         {rentListings && rentListings.length > 0 && (
//           <div className="m-2 mb-6">
//             <h2 className="px-3 text-2xl mt-6 font-semibold">Apartments for rent</h2>
//             <Link to="/category/rent">
//               <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
//                 Show more apartments for rent
//               </p>
//             </Link>
//             <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
//               {rentListings.map((listing) => (
//                 <ListingItem
//                   key={listing.id}
//                   listing={listing.data}
//                   id={listing.id}
//                 />
//               ))}
//             </ul>
//           </div>
//         )}
//         {saleListings && saleListings.length > 0 && (
//           <div className="m-2 mb-6">
//             <h2 className="px-3 text-2xl mt-6 font-semibold">Apartments for sale</h2>
//             <Link to="/category/sale">
//               <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
//                 Show more Apartments for sale
//               </p>
//             </Link>
//             <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
//               {saleListings.map((listing) => (
//                 <ListingItem
//                   key={listing.id}
//                   listing={listing.data}
//                   id={listing.id}
//                 />
//               ))}
//             </ul>
//           </div>
//         )}

//        {officeListings && officeListings.length > 0 && (
//           <div className="m-2 mb-6">
//             <h2 className="px-3 text-2xl mt-6 font-semibold">Offices for rent</h2>
//             <Link to="/category/sale">
//               <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
//                 Show more offices for rent
//               </p>
//             </Link>
//             <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
//               {officeListings.map((listing) => (
//                 <ListingItem
//                   key={listing.id}
//                   listing={listing.data}
//                   id={listing.id}
//                 />
//               ))}
//             </ul>
//           </div>
//         )}


//        {propertyListings && propertyListings.length > 0 && (
//           <div className="m-2 mb-6">
//             <h2 className="px-3 text-2xl mt-6 font-semibold">Property for sale</h2>
//             <Link to="/category/sale">
//               <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
//                 Show more Commercial Properties for sale
//               </p>
//             </Link>
//             <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
//               {propertyListings.map((listing) => (
//                 <ListingItem
//                   key={listing.id}
//                   listing={listing.data}
//                   id={listing.id}
//                 />
//               ))}
//             </ul>
//           </div>
//         )}



//       </div>
//     </div>
//   );
// }
