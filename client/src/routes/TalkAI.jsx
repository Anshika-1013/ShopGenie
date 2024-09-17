import React, { useState, useEffect } from "react";
import { Drawer, IconButton, Typography, InputBase, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AiItemCard from "../components/Card/AiitemCard/AiItemCard";
import { callChatGPTWithFunctions, searchProduct } from "../test";
import { useContext } from "react";
import { WishItemsContext } from "../Context/WishItemsContext";
import { CartItemsContext } from "../Context/CartItemsContext";
import { getLinearProgressUtilityClass } from "@mui/material";
import back_ground_logo from "../asset/img/back_ground_logo.png"
const TalkAI = (props) => {
  // const searchctxString = window.sessionStorage.getItem("searchctx");

// Parse the JSON string into an object
// const searchctx = JSON.parse(searchctxString);

// Log the parsed object
// console.log(searchctx);

  const [open, setOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  //const [chatHistory, setChatHistory] = useState([]);
  const [productData, setProductData] = useState(null); // Initialize productData as null
  // useEffect(() => {
  //   // Load initial product data when component mounts
  //   const fetchData = async () => {
  //     const products = await searchProduct("");
  //     setProductData(products);
  //   };
  //   fetchData();
  // }, []);
  const  cartItemsContext  = useContext(CartItemsContext)
  const wishItemsContext = useContext(WishItemsContext)
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
    if (inputValue.trim() !== "") {
      
      props.setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { sender: "user", message: inputValue },
      ]);

      setInputValue("");
  const res = await callChatGPTWithFunctions(inputValue);
      setTimeout(() => {
        props.setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { sender: "ShopGenie", message: `${res.message.content}` },
        ]);
        // Update productData with the search results
        const searchResults = JSON.parse(window.sessionStorage.getItem("searchedProducts"));
        setProductData(searchResults);
        const newWishItem=JSON.parse(window.sessionStorage.getItem("newWish"))
        if(newWishItem){
          let newWish = {
            name: newWishItem.title,
            price: newWishItem.price,
            image: newWishItem.thumbnail,
            description: newWishItem.description,
            _id: newWishItem.id,
            category: newWishItem.category,
            size:["S","M"]
          }
          //_id, name, price, image, category, size
            wishItemsContext.addItem(newWish)

        }
     
        const newCartItem=JSON.parse(window.sessionStorage.getItem("newCart")?window.sessionStorage.getItem("newCart"):{})
        
        if(newCartItem){
          let newCart = {
            name: newCartItem.title,
            price: newCartItem.price,
            image: newCartItem.thumbnail,
            description: newCartItem.description,
            _id: newCartItem.id,
            category: newCartItem.category,
            size:["S","M"]
            // _id, name, price, image, category, size
          }
          cartItemsContext.addItem(newCart,1)
        }

      }, 500);
    }
    
  };
  

  return (
    <>
      {!open ? (
        <IconButton
          sx={{
            position: "fixed",
            top: "66px",
            right: "22px",
            backgroundColor: "#ffe26e",
            color: "#000000",
            width: "46px",
            height: "46px",
            borderRadius: "10px",
            zIndex: 9999,
            ":hover": {
              backgroundColor: "#111111",
              animation: "smooth",
              color: "#ffffff",
            }, // Ensure it's on top of other content
          }}
          onClick={toggleDrawer}
        >
          <Typography variant="h6">AI</Typography>
        </IconButton>
      ) : (
        <></>
      )}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: "70%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f5f5f5",
            color: "#fff",
          },
        }}
      >
        {
          <IconButton
            sx={{ alignSelf: "flex-end", margin: "10px" }}
            onClick={toggleDrawer}
          >
            <CloseIcon />
          </IconButton>
        }
        <div
          style={{
            flexGrow: 1,
            padding: "20px",
            overflowY: "auto",
            color: "#111111",
          }}
        >
          {props.chatHistory.map((chat, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                textAlign: chat.sender === "user" ? "right" : "left",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {chat.sender === "user" ? "You" : "ShopGenie"}:
              </Typography>
              <Typography variant="body1">{chat.message}</Typography>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <InputBase
            placeholder="Type a message..."
            fullWidth
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleEnterPress}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "10px",
              marginRight: "10px",
            }}
          />
          <Button
            style={{ background: "#ffe26e", color: "#111111" }}
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </Drawer>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {/* {productData? console.log(productData.product):console.log("null")} */}
        {productData && productData.products ? (
          productData.products.map((product) => (
            <AiItemCard item={product} key={product.id} />
          ))
        ) : (
          <div><img src={back_ground_logo}></img></div>
        )}
        {/* You can add more ItemCards here */}
      </div>
    </>
  );
};

export default TalkAI;























// import React, { useState } from "react";
// import { Drawer, IconButton, Typography, InputBase, Button } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import SendIcon from "@mui/icons-material/Send";
// import AiItemCard from "../components/Card/AiitemCard/AiItemCard";
// import { callChatGPTWithFunctions,searchProduct } from "../test";
// const TalkAI = () => {
//   const [open, setOpen] = useState(true);
//   const [inputValue, setInputValue] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//  // const productData = JSON.parse(searchProduct);
//  let productData={}
//  if(searchProduct && searchProduct.length > 0){ productData=searchProduct.products;}

//  console.log(searchProduct)
//  console.log(productData)
//   const toggleDrawer = () => {
//     setOpen(!open);
//   };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleEnterPress = (e) => {
//     if (e.key === "Enter") {
//       handleSendMessage();
//     }
//   };

//   const handleSendMessage = async() => {
//   if (inputValue.trim() !== "") {
//     const res=await callChatGPTWithFunctions(inputValue);
//     console.log(res.message.content);
//     setChatHistory(prevChatHistory => [
//       ...prevChatHistory,
//       { sender: "user", message: inputValue }
//     ]);
//     setInputValue("");

//     setTimeout(() => {
//       setChatHistory(prevChatHistory => [
//         ...prevChatHistory,
//         { sender: "AI", message: `${res.message.content}` }
//       ]);
//     }, 500);
//   }
// };


//   return (
//     <>
//       {!open?<IconButton
//         sx={{
//           position: "fixed",
//           top: "66px",
//           right: "22px",
//           backgroundColor: "#ffe26e",
//           color: "#000000",
//           width:"46px",
//           height:"46px",
//           borderRadius:"10px",
//           zIndex: 9999, 
//           ":hover":{backgroundColor:"#111111",animation:"smooth",color:"#ffffff"}// Ensure it's on top of other content
//          }}
//         onClick={toggleDrawer}
//       >
//         <Typography variant="h6">
//           AI
//         </Typography>
//       </IconButton>:<></>}
//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={toggleDrawer}
//         sx={{
//           "& .MuiDrawer-paper": {
//             width: "70%",
//             maxWidth: "400px",
//             display: "flex",
//             flexDirection: "column",
//             backgroundColor: "#f5f5f5",
//             color: "#fff",
//           },
//         }}
//       >
//         {<IconButton
//           sx={{ alignSelf: "flex-end", margin: "10px" }}
//           onClick={toggleDrawer}
//         >
//           <CloseIcon />
//         </IconButton>}
//         <div style={{ flexGrow: 1, padding: "20px", overflowY: "auto", color:"#111111"}}>
//           {chatHistory.map((chat, index) => (
//             <div key={index} style={{ marginBottom: "10px", textAlign: chat.sender === "user" ? "right" : "left" }}>
//               <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                 {chat.sender === "user" ? "You" : "AI"}:
//               </Typography>
//               <Typography variant="body1">{chat.message}</Typography>
//             </div>
//           ))}
//         </div>
//         <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
//           <InputBase
//             placeholder="Type a message..."
//             fullWidth
//             value={inputValue}
//             onChange={handleInputChange}
//             onKeyDown={handleEnterPress}
//             sx={{ backgroundColor: "#fff", borderRadius: "20px", padding: "10px", marginRight: "10px" }}
//           />
//           <Button style={{background:"#ffe26e", color:"#111111"}} variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
//             Send
//           </Button>
//         </div>
//       </Drawer>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
//             {/* Example ItemCard */}
//             {productData && productData !== ""  ? (
//             productData.products.map((product) => {(
//                 <AiItemCard item={product} key={product.id} />
//             );console.log(product)})
//         ) : (
//             <div>results</div>
//         )}
            

//             {/* You can add more ItemCards here */}
//           </div>
//     </>
//   );
// };

// export default TalkAI;




