// import React, { useState, useEffect } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { useParams } from "react-router-dom";
// import Spinner from "../components/Spinner";
// import { db } from "../firebase";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from "swiper";
// import "swiper/css/bundle";
// import { FaShare, FaMapMarkerAlt, FaTshirt } from "react-icons/fa";
// import { getAuth } from "firebase/auth";
// import Contact from "../components/Contact";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/effect-fade";
// import "swiper/css/navigation";
// import "swiper/css/pagination";


// export default function Listing() {
//   const auth = getAuth();
//   const params = useParams();
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [shareLinkCopied, setShareLinkCopied] = useState(false);
//   const [contactSeller, setContactSeller] = useState(false);
//   SwiperCore.use([Autoplay, Navigation, Pagination]);

//   useEffect(() => {
//     async function fetchListing() {
//       try {
//         const docRef = doc(db, "products", params.productId);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setListing(docSnap.data());
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Error fetching listing:", error);
//         setLoading(false);
//       }
//     }

//     fetchListing();
//   }, [params.productId]);

//   if (loading) {
//     return <Spinner />;
//   }

//   const { name, description, color, sizes, images, userRef } = listing;

//   return (
//     <main className="max-w-6xl mx-auto mt-8">
//       <Swiper
//         slidesPerView={1}
//         navigation
//         pagination={{ type: "progressbar" }}
//         effect="fade"
//         modules={[EffectFade]}
//         autoplay={{ delay: 3000 }}
//       >
//         {images.map((url, index) => (
//           <SwiperSlide key={index}>
//             <div
//               className="relative w-full h-[300px] overflow-hidden"
//               style={{
//                 background: `url(${images[index]}) center no-repeat`,
//                 backgroundSize: "cover",
//               }}
//             ></div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <div className="bg-white p-6 rounded-md shadow-md mt-4">
//         <div className="flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-blue-900">{name}</h2>
//           <div className="flex items-center space-x-2">
//             <button
//               className="text-gray-500 hover:text-gray-800 transition duration-150 ease-in-out"
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href);
//                 setShareLinkCopied(true);
//                 setTimeout(() => {
//                   setShareLinkCopied(false);
//                 }, 2000);
//               }}
//             >
//               <FaShare className="text-lg" />
//             </button>
//             {shareLinkCopied && (
//               <p className="text-green-600 font-semibold ml-2">Link Copied</p>
//             )}
//           </div>
//         </div>
//         <p className="text-gray-600 mt-3">{description}</p>
//         <div className="flex items-center space-x-2 mt-6">
//           <FaTshirt className="text-lg" />
//           <p className="text-gray-600">
//             Colors: {color.join(", ")} | Sizes: {sizes.join(", ")}
//           </p>
//         </div>
//         <div className="mt-6">
//           <FaMapMarkerAlt className="text-green-700 mr-2" />
//           <span className="text-gray-600">Location Here</span>
//         </div>
//         {userRef !== auth.currentUser?.uid && !contactSeller && (
//           <div className="mt-6">
//             <button
//               onClick={() => setContactSeller(true)}
//               className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg transition duration-150 ease-in-out"
//             >
//               Contact Seller
//             </button>
//           </div>
//         )}
//       </div>

//       {contactSeller && <Contact userRef={userRef} listing={listing} />}
//     </main>
//   );
// }
