import { useContext, useState } from "react";
import { CartItemsContext } from "./CartItemsContext";
import { WishItemsContext } from "./WishItemsContext";
import{auth,db,app} from "../firebase"
import {doc,setDoc} from "firebase/firestore"
const WishItemsProvider = (props) => {
    const [ wishItems, setWishItems ] = useState([])

    const cartItems = useContext(CartItemsContext)

    const addToCartHandler = async (item) => {
        cartItems.addItem(item, 1)
       // await setDoc(doc(db,"cartlist",auth.currentUser.email),{cartItems})
    }
    

    const addToWishHnadler = async (item) => {
        const { _id, name, price, image, category, size } = item;
        removeFromWishHandler(item)
        if(auth.currentUser.email){
        setWishItems((prevItems) => [...prevItems, {_id, name, price, image, category, size, itemQuantity: 1}])
        console.log(wishItems)
        await setDoc(doc(db,"wishlist",auth.currentUser.email),{wishItems})}
        else{window.prompt("Please login to proceed")}
    }

    const removeFromWishHandler = async(item) => {
        setWishItems(wishItems.filter((prevItem) => prevItem._id !== item._id))
        await setDoc(doc(db,"wishlist",auth.currentUser.email),{wishItems})}
    

    const wishItemsCtx = {
        items: wishItems,
        addItem: addToWishHnadler,
        removeItem: removeFromWishHandler,
        addToCart: addToCartHandler
    }

    return ( 
        <WishItemsContext.Provider value={wishItemsCtx}>
            {props.children}
        </WishItemsContext.Provider>
     );
}
 
export default WishItemsProvider;