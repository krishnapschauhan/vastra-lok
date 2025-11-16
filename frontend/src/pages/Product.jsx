import React,{useEffect,useContext,useState} from 'react'
import { useParams } from "react-router-dom";
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {
  const {productId} = useParams();
  const {products, currency,addToCart, navigate, cartItems } = useContext(ShopContext);

  const [productData,setProductData] = useState(false);
  const [image,setImage] =  useState('');
  const [size,setSize]=useState('');

  // ⭐ Detect if the item (with selected size) is ALREADY in cart
  const added = size && cartItems?.[productId]?.[size] > 0;

  // ⭐ Seeded random so ratings stay SAME every refresh
  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  const seed = parseInt(productId.slice(-3), 16);
  const randomRating = Math.floor(seededRandom(seed) * 3) + 3;
  const randomReviews = Math.floor(seededRandom(seed + 1) * 380) + 20;
  const stars = Array.from({ length: 5 }, (_, i) => i < randomRating);

  const oldPrice = Math.round((productData?.price || 0) * 1.3);  
  const discountPercent = Math.round(((oldPrice - productData?.price) / oldPrice) * 100);

  const fetchProductData = async () =>{
    products.map((item)=>{
      if(item._id===productId){
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    })
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  useEffect(()=>{
    fetchProductData();
  },[productId,products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>

     <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

      <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
        <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
          {productData.image.map((item,index)=>(
            <img 
              onClick={()=>setImage(item)} 
              src={item} 
              key={index} 
              className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
            />
          ))}
        </div>

        <div className='w-full sm:w-[80%'>
          <img className='w-full h-auto' src={image} />
        </div>
      </div>

      <div className='flex-1'>
        <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

        <div className='flex items-center gap-1 mt-2'>
          {stars.map((filled, i) => (
            <img
              key={i}
              src={filled ? assets.star_icon : assets.star_dull_icon}
              className="w-3.5"
              alt=""
            />
          ))}
          <p className='pl-2'>({randomReviews})</p>
        </div>

        <div className='mt-5 flex items-center gap-3'>
          <p className='text-3xl font-medium'>{currency}{productData.price}</p>

          <p className='text-gray-500 line-through text-lg'>
            {currency}{oldPrice}
          </p>

          <span className='bg-green-600 text-white text-xs px-2 py-1 rounded-md'>
            {discountPercent}% OFF
          </span>
        </div>

        <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

        <div className='flex flex-col gap-4 my-8'>
          <p>Select Size</p>
          <div className='flex gap-2'>
            {productData.sizes.map((item,index)=>(
              <button 
                onClick={()=>setSize(item)} 
                className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : '' }`} 
                key={index}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ⭐ AUTO-DETECT BUTTON */}
        <button 
          onClick={()=>{
            if (!size) {
              toast.error("Please select a size");
              return;
            }

            if (!added) {
              addToCart(productData._id,size);
            } else {
              navigate('/cart');
            }
          }} 
          className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
        >
          {added ? "GO TO CART" : "ADD TO CART"}
        </button>

        <hr className='mt-8 sm:w-4/5' />

        <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
          <p>100% Original product.</p>
          <p>Cash on delivery is available on this product.</p>
          <p>Easy return and exchange policy within 7 days.</p>
        </div>

      </div>
    </div>

    <div className='mt-20'>
      <div className='flex'>
        <b className='border px-5 py-3 text-sm'>Description</b>
        <p className='border px-5 py-3 text-sm'>Reviews({randomReviews})</p>
      </div>

      <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
        <p>Discover the latest trends and unbeatable deals all in one place.</p>
        <p>Shop your favorites and get them delivered to your doorstep.</p>
      </div>
   </div>

   <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
