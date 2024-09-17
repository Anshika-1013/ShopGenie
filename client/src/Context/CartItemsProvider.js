// import { useEffect, useState } from "react";
// import { CartItemsContext } from "./CartItemsContext";
// import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
// import { app, auth, db } from "../firebase";

// const CartItemsProvider = (props) => {
//     const [cartItems, setCartItems] = useState([]);
//     const [totalAmountOfItems, setTotalAmountOfItems] = useState(0);

//     const addToCartHandler = async(item, quantity) => {
//         const { _id, name, price, image, category, size } = item;
//         removeFromCartHandler(item);
//         const cartItemData = { _id, name, price, image, category, itemQuantity: quantity, size };
//         const cartRef = doc(db, "cartlist", auth.currentUser.email);
//         const cartDocSnap = await getDoc(cartRef);

//         if (cartDocSnap.exists()) {
//             // If the document already exists, update it
//             await updateDoc(cartRef, {
//                 cartItems: [...cartDocSnap.data().cartItems, cartItemData]
//             });
//         } else {
//             // If the document doesn't exist, set it with the new cart item
//             await setDoc(cartRef, { cartItems: [cartItemData] });
//         }
//     };

//     const removeFromCartHandler = async(item) => {
//         setCartItems(cartItems.filter((prevItem) => prevItem._id !== item._id));
//         const cartRef = doc(db, "cartlist", auth.currentUser.email);
//         const cartDocSnap = await getDoc(cartRef);

//         if (cartDocSnap.exists()) {
//             // If the document already exists, update it without the removed item
//             const updatedCartItems = cartDocSnap.data().cartItems.filter((prevItem) => prevItem._id !== item._id);
//             await updateDoc(cartRef, { cartItems: updatedCartItems });
//         } else {
//             // If the document doesn't exist, there's nothing to remove
//             console.log("Cart document doesn't exist.");
//         }
//     };

//     const calculateTotalAmount = (currentCartItems) => {
//         let total = 0;
//         currentCartItems.forEach((item) => {
//             total = total + (item.price * item.itemQuantity);
//         });

//         setTotalAmountOfItems(total);
//     };

//     const quantityHandler = (itemId, action) => {
//         // Quantity handler logic here
//     };

//     useEffect(() => {
//         calculateTotalAmount(cartItems);
//     }, [cartItems]);

//     const cartItemCtx = {
//         items: cartItems,
//         totalAmount: totalAmountOfItems,
//         addItem: addToCartHandler,
//         removeItem: removeFromCartHandler,
//         quantity: quantityHandler,
//     };

//     return (
//         <CartItemsContext.Provider value={cartItemCtx}>
//             {props.children}
//         </CartItemsContext.Provider>
//     );
// };

// export default CartItemsProvider;






















import { useEffect, useState } from "react";
import { CartItemsContext } from "./CartItemsContext";
import { setDoc,doc } from "firebase/firestore";
import{app,auth,db}from "../firebase";
const CartItemsProvider = (props) => {

    const [cartItems, setCartItems] = useState([])
    const [totalAmountOfItems, setTotalAmountOfItems] = useState(0)
    
    const addToCartHandler = async(item, quantity) => {
        const { _id, name, price, image, category, size} = item;
        removeFromCartHandler(item)
        setCartItems((prevItems) => [...prevItems, {_id, name, price, image, category, itemQuantity: quantity, size}])
        await setDoc(doc(db,"cartlist",auth.currentUser.email),{cartItems})
    }

    const removeFromCartHandler = async(item) => {
        setCartItems(cartItems.filter((prevItem) => prevItem._id !== item._id))
        await setDoc(doc(db,"cartlist",auth.currentUser.email),{cartItems})
    }

    const calculateTotalAmount = (currentCartItems) => {
        let total = 0
        currentCartItems.forEach((item) => {
            total = total + (item.price*10 * item.itemQuantity)
        })

        setTotalAmountOfItems(total)
    }

    const quantityHandler = (itemId, action) => {
        if(action === 'INC'){
            setCartItems(cartItems.map((item) => {
                if(item.id  === itemId){
                    item.itemQuantity += 1
                }
                return item
            }))
        }
        else {
            setCartItems(cartItems.map((item) => {
                if(item.id  === itemId){
                    item.itemQuantity -= 1
                }
                return item
            }))
        }
    }

    useEffect(() => {
        calculateTotalAmount(cartItems)
    }, [cartItems])


    const cartItemCtx = {
        items: cartItems,
        totalAmount: totalAmountOfItems,
        addItem: addToCartHandler,
        removeItem: removeFromCartHandler,
        quantity: quantityHandler
    }

    return ( 
        <CartItemsContext.Provider value={cartItemCtx}>
            {props.children}
        </CartItemsContext.Provider>
     );
}
 
export default CartItemsProvider;