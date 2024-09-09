import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  const { name, description, color, sizes, imgUrls } = listing;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imgUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imgUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
      <div className="relative">
        <button
          className="absolute top-1/2 transform -translate-y-1/2 -left-10 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
          onClick={handlePrevImage}
        >
          <IoIosArrowBack />
        </button>
        <Link className="contents" to={`/product/${id}`}>
          <img
            className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
            loading="lazy"
            src={imgUrls[currentImageIndex]}
            alt={name}
          />
        </Link>
        <button
          className="absolute top-1/2 transform -translate-y-1/2 -right-10 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
          onClick={handleNextImage}
        >
          <IoIosArrowForward />
        </button>
      </div>
      <div className="w-full p-[10px]">
        <p className="font-semibold m-0 text-xl truncate">{name}</p>
        <p className="text-gray-600 mt-2 max-h-[3.6em] overflow-hidden line-clamp-2">
          {description}
        </p>
        <p className="text-gray-600 mt-2">Colors: {color.join(", ")}</p>
        <p className="text-gray-600 mt-2">Sizes: {sizes.join(", ")}</p>
      </div>
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer "
          onClick={() => onEdit(id)}
        />
      )}
    </li>
  );
}

