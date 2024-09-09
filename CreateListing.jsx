import React from 'react';
import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [Brand, setBrand] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: 0,
    // offerPrice: null,
    color: [],
    sizes: [],
    images: {},
    Brand: "", 
  });

  const {
    name,
    category,
    description,
    price,
    // offerPrice,
    color,
    sizes,
    images,
  } = formData;

  function onChange(e) {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }

   
    if (!e.target.files) {
      let value = e.target.value;

      if (e.target.id === "color" || e.target.id === "sizes") {
        // Treat color and sizes as arrays
        value = value.split(",").map((item) => item.trim());
      } else if (e.target.id === "Brand") { // Handle the brand field separately
        setBrand(value);
      }

      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Validation logic
    if (!name || !category || !description || !price || !color || !sizes || images.length === 0) {
      setLoading(false);
      toast.error("Please fill out all required fields");
      return;
    }

      // Convert price and offerPrice to numbers
  const numericPrice = parseFloat(price);
  
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${uuidv4()}-${image.name}`;
        const storageRef = ref(storage, `products/images/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress if needed
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error("Error during upload:", error);
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("Image upload successful. Download URL:", downloadURL);
                resolve(downloadURL);
              })
              .catch((error) => {
                console.error("Error getting download URL:", error);
                reject(error);
              });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      price: numericPrice,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
      Brand,
    };

    delete formDataCopy.images;

    const docRef = await addDoc(collection(db, "products"), formDataCopy);
    setLoading(false);
    toast.success("Product added");
    navigate(`/product/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Add a Product</h1>
      <form onSubmit={onSubmit}>
        {/* Product Name */}
        <label htmlFor="name" className="block text-lg mt-6 font-semibold">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Enter product name"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <label htmlFor="brand" className="block text-lg mt-6 font-semibold">
          Brand
        </label>
        <input
          type="text"
          id="Brand"
          value={Brand}
          onChange={onChange}
          placeholder="Enter brand name"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        {/* Product Category */}
        <label htmlFor="category" className="block text-lg mt-6 font-semibold">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={onChange}
          placeholder="Enter product category"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        {/* Product Description */}
        <label
          htmlFor="description"
          className="block text-lg mt-6 font-semibold"
        >
          Description
        </label>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Enter product description"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        {/* Product Price */}
        <label htmlFor="price" className="block text-lg mt-6 font-semibold">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={onChange}
          placeholder="Enter product price"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        {/* Product Colors */}
        <label htmlFor="colors" className="block text-lg mt-6 font-semibold">
          Colors
        </label>
        <input
          type="text"
          id="color"
          value={color}
          onChange={onChange}
          placeholder="Enter product colors (comma-separated)"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        {/* Product Sizes */}
        <label htmlFor="sizes" className="block text-lg mt-6 font-semibold">
          Sizes
        </label>
        <input
          type="text"
          id="sizes"
          value={sizes}
          onChange={onChange}
          placeholder="Enter product sizes (comma-separated)"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        {/* Product Images */}
        <label htmlFor="images" className="block text-lg mt-6 font-semibold">
          Images
        </label>
        <input
          type="file"
          id="images"
          onChange={onChange}
          accept=".jpg,.png,.jpeg"
          multiple
          required
          className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Add Product
        </button>
      </form>
    </main>
  );
}





// import { useState } from "react";
// import Spinner from "../components/Spinner";
// import { toast } from "react-toastify";
// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";
// import { getAuth } from "firebase/auth";
// import { v4 as uuidv4 } from "uuid";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebase";
// import { useNavigate } from "react-router-dom";

// export default function CreateListing() {
//   const navigate = useNavigate();
//   const auth = getAuth();
//   const [geolocationEnabled, setGeolocationEnabled] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     type: "rent",
//     name: "",
//     bedrooms: 1,
//     bathrooms: 1,
//     parking: false,
//     furnished: false,
//     address: "",
//     description: "",
//     offer: false,
//     regularPrice: 0,
//     discountedPrice: 0,
//     latitude: 0,
//     longitude: 0,
//     images: {},
//   });


  
//   const {
//     type,
//     name,
//     bedrooms,
//     bathrooms,
//     parking,
//     address,
//     furnished,
//     description,
//     offer,
//     regularPrice,
//     discountedPrice,
//     latitude,
//     longitude,
//     images,
//   } = formData;
//   function onChange(e) {
//     let boolean = null;
//     if (e.target.value === "true") {
//       boolean = true;
//     }
//     if (e.target.value === "false") {
//       boolean = false;
//     }
//     // Files
//     if (e.target.files) {
//       setFormData((prevState) => ({
//         ...prevState,
//         images: e.target.files,
//       }));
//     }
//     // Text/Boolean/Number
//     if (!e.target.files) {
//       setFormData((prevState) => ({
//         ...prevState,
//         [e.target.id]: boolean ?? e.target.value,
//       }));
//     }
//   }
//   async function onSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     if (+discountedPrice >= +regularPrice) {
//       setLoading(false);
//       toast.error("Discounted price needs to be less than regular price");
//       return;
//     }
//     if (images.length > 6) {
//       setLoading(false);
//       toast.error("maximum 6 images are allowed");
//       return;
//     }
//     let geolocation = {};
//     let location;
//     if (geolocationEnabled) {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
//       );
//       const data = await response.json();
//       console.log(data);
//       geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
//       geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

//       location = data.status === "ZERO_RESULTS" && undefined;

//       if (location === undefined) {
//         setLoading(false);
//         toast.error("please enter a correct address");
//         return;
//       }
//     } else {
//       geolocation.lat = latitude;
//       geolocation.lng = longitude;
//     }

//     async function storeImage(image) {
//       return new Promise((resolve, reject) => {
//         const storage = getStorage();
//         const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
//         const storageRef = ref(storage, filename);
//         const uploadTask = uploadBytesResumable(storageRef, image);
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             // Observe state change events such as progress, pause, and resume
//             // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//             const progress =
//               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log("Upload is " + progress + "% done");
//             switch (snapshot.state) {
//               case "paused":
//                 console.log("Upload is paused");
//                 break;
//               case "running":
//                 console.log("Upload is running");
//                 break;
//             }
//           },
//           (error) => {
//             // Handle unsuccessful uploads
//             reject(error);
//           },
//           () => {
//             // Handle successful uploads on complete
//             // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//               resolve(downloadURL);
//             });
//           }
//         );
//       });
//     }

//     const imgUrls = await Promise.all(
//       [...images].map((image) => storeImage(image))
//     ).catch((error) => {
//       setLoading(false);
//       toast.error("Images not uploaded");
//       return;
//     });

//     const formDataCopy = {
//       ...formData,
//       imgUrls,
//       geolocation,
//       timestamp: serverTimestamp(),
//       userRef: auth.currentUser.uid,
//     };
//     delete formDataCopy.images;
//     !formDataCopy.offer && delete formDataCopy.discountedPrice;
//     delete formDataCopy.latitude;
//     delete formDataCopy.longitude;
//     const docRef = await addDoc(collection(db, "listings"), formDataCopy);
//     setLoading(false);
//     toast.success("Listing created");
//     navigate(`/category/${formDataCopy.type}/${docRef.id}`);
//   }

//   if (loading) {
//     return <Spinner />;
//   }
//   return (
//     <main className="max-w-md px-2 mx-auto">
//       <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
//       <form onSubmit={onSubmit}>
//         <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
//         <div className="flex">
//           <button
//             type="button"
//             id="type"
//             value="sale"
//             onClick={onChange}
//             className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               type === "rent"
//                 ? "bg-white text-black"
//                 : "bg-slate-600 text-white"
//             }`}
//           >
//             Sell apartment
//           </button>
//           <button
//             type="button"
//             id="type"
//             value="rent"
//             onClick={onChange}
//             className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               type === "sale"
//                 ? "bg-white text-black"
//                 : "bg-slate-600 text-white"
//             }`}
//           >
//             Rent Apartment
//           </button>

//           <button
//             type="button"
//             id="type"
//             value="property"
//             onClick={onChange}
//             className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               type === "sale"
//                 ? "bg-white text-black"
//                 : "bg-slate-600 text-white"
//             }`}
//           >
//             Sell Property
//           </button>

//           <button
//             type="button"
//             id="type"
//             value="office"
//             onClick={onChange}
//             className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               type === "office"
//                 ? "bg-white text-blue"
//                 : "bg-slate-600 text-white"
//             }`}
//           >
//             Office Space for rent
//           </button>

//         </div>
//         <p className="text-lg mt-6 font-semibold">Name</p>
//         <input
//           type="text"
//           id="name"
//           value={name}
//           onChange={onChange}
//           placeholder="Name"
//           maxLength="32"
//           minLength="10"
//           required
//           className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
//         />
//         <div className="flex space-x-6 mb-6">
//           {/* Render bedrooms and bathrooms only for rent and sale */}
//         {(type === "rent" || type === "sale") && (
//           <div className="flex space-x-6 mb-6">
//             <div>
//               <p className="text-lg font-semibold">Beds</p>
//               <input
//                 type="number"
//                 id="bedrooms"
//                 value={bedrooms}
//                 onChange={onChange}
//                 min="1"
//                 max="50"
//                 required
//                 className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
//               />
//             </div>
//             <div>
//               <p className="text-lg font-semibold">Baths</p>
//               <input
//                 type="number"
//                 id="bathrooms"
//                 value={bathrooms}
//                 onChange={onChange}
//                 min="1"
//                 max="50"
//                 required
//                 className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
//               />
//             </div>
//           </div>
//         )}

//         </div>
//         <p className="text-lg mt-6 font-semibold">Parking spot</p>
//         <div className="flex">
//           <button
//             type="button"
//             id="parking"
//             value={true}
//             onClick={onChange}
//             className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               !parking ? "bg-white text-black" : "bg-slate-600 text-white"
//             }`}
//           >
//             Yes
//           </button>
//           <button
//             type="button"
//             id="parking"
//             value={false}
//             onClick={onChange}
//             className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               parking ? "bg-white text-black" : "bg-slate-600 text-white"
//             }`}
//           >
//             no
//           </button>
//         </div>
//         <p className="text-lg mt-6 font-semibold">Furnished</p>
//         <div className="flex">
//           <button
//             type="button"
//             id="furnished"
//             value={true}
//             onClick={onChange}
//             className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
//             }`}
//           >
//             yes
//           </button>
//           <button
//             type="button"
//             id="furnished"
//             value={false}
//             onClick={onChange}
//             className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               furnished ? "bg-white text-black" : "bg-slate-600 text-white"
//             }`}
//           >
//             no
//           </button>
//         </div>
//         <p className="text-lg mt-6 font-semibold">Address</p>
//         <textarea
//           type="text"
//           id="address"
//           value={address}
//           onChange={onChange}
//           placeholder="Address"
//           required
//           className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
//         />
//         {!geolocationEnabled && (
//           <div className="flex space-x-6 justify-start mb-6">
//             <div className="">
//               <p className="text-lg font-semibold">Latitude</p>
//               <input
//                 type="number"
//                 id="latitude"
//                 value={latitude}
//                 onChange={onChange}
//                 required
//                 min="-90"
//                 max="90"
//                 className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
//               />
//             </div>
//             <div className="">
//               <p className="text-lg font-semibold">Longitude</p>
//               <input
//                 type="number"
//                 id="longitude"
//                 value={longitude}
//                 onChange={onChange}
//                 required
//                 min="-180"
//                 max="180"
//                 className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
//               />
//             </div>
//           </div>
//         )}
//         <p className="text-lg font-semibold">Description</p>
//         <textarea
//           type="text"
//           id="description"
//           value={description}
//           onChange={onChange}
//           placeholder="Description"
//           required
//           className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
//         />
//         <p className="text-lg font-semibold">Offer</p>
//         <div className="flex mb-6">
//           <button
//             type="button"
//             id="offer"
//             value={true}
//             onClick={onChange}
//             className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               !offer ? "bg-white text-black" : "bg-slate-600 text-white"
//             }`}
//           >
//             yes
//           </button>
//           <button
//             type="button"
//             id="offer"
//             value={false}
//             onClick={onChange}
//             className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
//               offer ? "bg-white text-black" : "bg-slate-600 text-white"
//             }`}
//           >
//             no
//           </button>
//         </div>
//         <div className="flex items-center mb-6">
//           <div className="">
//             <p className="text-lg font-semibold">Regular price</p>
//             <div className="flex w-full justify-center items-center space-x-6">
//               <input
//                 type="number"
//                 id="regularPrice"
//                 value={regularPrice}
//                 onChange={onChange}
//                 min="50"
//                 max="400000000"
//                 required
//                 className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
//               />
//               {type === "rent" && (
//                 <div className="">
//                   <p className="text-md w-full whitespace-nowrap">$ / Month</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {offer && (
//           <div className="flex items-center mb-6">
//             <div className="">
//               <p className="text-lg font-semibold">Discounted price</p>
//               <div className="flex w-full justify-center items-center space-x-6">
//                 <input
//                   type="number"
//                   id="discountedPrice"
//                   value={discountedPrice}
//                   onChange={onChange}
//                   min="50"
//                   max="400000000"
//                   required={offer}
//                   className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
//                 />
//                 {type === "rent" && (
//                   <div className="">
//                     <p className="text-md w-full whitespace-nowrap">
//                       $ / Month
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//         <div className="mb-6">
//           <p className="text-lg font-semibold">Images</p>
//           <p className="text-gray-600">
//             The first image will be the cover (max 6)
//           </p>
//           <input
//             type="file"
//             id="images"
//             onChange={onChange}
//             accept=".jpg,.png,.jpeg"
//             multiple
//             required
//             className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
//           />
//         </div>
//         <button
//           type="submit"
//           className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
//         >
//           Create Listing
//         </button>
//       </form>
//     </main>
//   );
// }
