const { useContext } = require('react');
const { WishItemsContext } = require('../src/Context/WishItemsContext');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');

const apiKey = "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";
let searchProducts = {}; // Define searchProducts as a variable instead of constant
let searchctx = {};
  
const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
});

// Define your function
function helloWorld(appendString) {
    let hello = "Hello! " + appendString+"\n"+"try searching for a product"
    return hello
}
//searchedProducts
// Get the current time of day
function getTimeOfDay() {
    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    let timeOfDay = "AM"
    if (hours > 12) {
        hours = hours - 12
        timeOfDay = "PM"
    }
    return hours + ":" + minutes + ":" + seconds + " " + timeOfDay
}

// Function to search for a product from an API
async function searchProduct(query) {
    const url = `https://dummyjson.com/products/search?q=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        searchProducts=data
        return data;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

function addToWishlist(products, productIndex) {
    
    window.sessionStorage.setItem("newWish", JSON.stringify(products[productIndex]));
    console.log("new=", products[productIndex]);
    // window.sessionStorage.setItem("newWish", JSON.stringify(products[productIndex]));
    // console.log("new=", products[productIndex]);
}

function addToCart(products, productIndex) {
    // Implement addToCart functionality here
    window.sessionStorage.setItem("newCart", JSON.stringify(products[productIndex]));
    console.log("Adding product to cart:", products[productIndex]);
}

// New function: searchPriceAddToCart
async function searchPriceAddToCart() {
    if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
        const sortedProducts = searchProducts.products.slice().sort((a, b) => a.price - b.price);
        const lowestPriceProduct = sortedProducts[0];
        addToCart(searchProducts.products, searchProducts.products.indexOf(lowestPriceProduct));
        searchctx=`${lowestPriceProduct}`
        console.log(searchctx.products)
        // searchProduct=lowestPriceProduct

        //json.stringyfy might be required
        return `Product with the lowest price (${lowestPriceProduct.price}) added to cart.`;
    } else {
        return "No products found to add to the cart.";
    }
   
}

// New function: searchPriceAddToWishlist
async function searchPriceAddToWishlist() {
    if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
        const sortedProducts = searchProducts.products.slice().sort((a, b) => a.price - b.price);
        const lowestPriceProduct = sortedProducts[0];
        addToWishlist(searchProducts.products, searchProducts.products.indexOf(lowestPriceProduct));
        searchctx=`${lowestPriceProduct}`
        return `Product with the lowest price (${lowestPriceProduct.price}) added to wishlist.`;
    } else {
        return "No products found to add to the wishlist.";
    }
}
async function searchRatingAddToCart() {
    if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
        const sortedProducts = searchProducts.products.slice().sort((a, b) => b.rating - a.rating);
        const highestRatedProduct = sortedProducts[0];
        addToCart(searchProducts.products, searchProducts.products.indexOf(highestRatedProduct));
        searchctx=`${highestRatedProduct}`
        return `Product with the highest rating (${highestRatedProduct.rating}) added to cart.`;
    } else {
        return "No products found to add to the cart.";
    }
}

// New function: searchRatingAddToWishlist
async function searchRatingAddToWishlist() {
    if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
        const sortedProducts = searchProducts.products.slice().sort((a, b) => b.rating - a.rating);
        const highestRatedProduct = sortedProducts[0];
        addToWishlist(searchProducts.products, searchProducts.products.indexOf(highestRatedProduct));
        searchctx=`${highestRatedProduct}`
        //

        //
        return `Product with the highest rating (${highestRatedProduct.rating}) added to wishlist.`;
        

    } else {
        return "No products found to add to the wishlist.";
    }
}
// New function: buyProductList
async function buyProductList(productList) {
    const availableProducts = [];
    const unavailableProducts = [];

    for (const product of productList) {
        const searchResult = await searchProduct(product.title);
        if (searchResult && searchResult.products && searchResult.products.length > 0) {
            const foundProduct = searchResult.products[0];
            addToCart(searchResult.products, searchResult.products.indexOf(foundProduct));
            availableProducts.push(foundProduct);
        } else {
            unavailableProducts.push(product);
        }
    }

    let response = "";
    if (availableProducts.length > 0) {
        response += `The following products have been added to the cart:\n`;
        availableProducts.forEach(product => {
            response += `- ${product.title} (${product.price})\n`;
        });
    }

    if (unavailableProducts.length > 0) {
        response += `\nThe following products were unavailable:\n`;
        unavailableProducts.forEach(product => {
            response += `- ${product.title}\n`;
        });
    }

    return response;
}
// 1. availableFunctions: List out the available functions for the user
function availableFunctions() {
    const functions = [
      { name: 'helloWorld', description: 'Prints hello world with the string passed to it' },
      { name: 'getTimeOfDay', description: 'Get the current time of day' },
      { name: 'searchProduct', description: 'Search for a product from an API' },
      { name: 'addToWishlist', description: 'Add a product to the wishlist' },
      { name: 'addToCart', description: 'Add a product to the cart' },
      { name: 'searchPriceAddToCart', description: 'Search for the product with the lowest price and add it to the cart' },
      { name: 'searchPriceAddToWishlist', description: 'Search for the product with the lowest price and add it to the wishlist' },
      { name: 'searchRatingAddToCart', description: 'Search for the product with the highest rating and add it to the cart' },
      { name: 'searchRatingAddToWishlist', description: 'Search for the product with the highest rating and add it to the wishlist' },
      { name: 'buyProductList', description: 'Search for a list of products and add the available ones to the cart' },
      { name: 'availableFunctions', description: 'Lists out the available functions with their descriptions' },
      { name: 'compareProducts', description: 'Compare two products with each other' },
      { name: 'searchBestPriceProducts', description: 'Search for the best products in terms of price and compare' },
      { name: 'searchBestRatingProducts', description: 'Search for the best products in terms of reviews and compare' }
    ];
  
    const functionsList = functions.map(func => `${func.name}: ${func.description}`).join('\n');
    return `Available functions:\n${functionsList}`;
  }
  function compareProducts(product1, product2) {
    if (!product1 || !product2) {
      return "Invalid product data provided.";
    }
  
    let comparison = "";
    comparison += `Comparing ${product1.title} and ${product2.title}:\n`;
    comparison += `Price: ${product1.title} (${product1.price}) vs ${product2.title} (${product2.price})\n`;
    comparison += `Rating: ${product1.title} (${product1.rating}) vs ${product2.title} (${product2.rating})\n`;
  
    if (product1.price < product2.price) {
      comparison += `${product1.title} has a lower price.\n`;
    } else if (product1.price > product2.price) {
      comparison += `${product2.title} has a lower price.\n`;
    } else {
      comparison += "Both products have the same price.\n";
    }
  
    if (product1.rating > product2.rating) {
      comparison += `${product1.title} has a higher rating.\n`;
    } else if (product1.rating < product2.rating) {
      comparison += `${product2.title} has a higher rating.\n`;
    } else {
      comparison += "Both products have the same rating.\n";
    }
    // searchctx.products.push(
    //  product1,
    // product2
    //   );
    //   console.log(searchctx.products)
    return comparison;
  }
  
  // 3. searchBestPriceProducts: Search for the best products in terms of price and compare
  async function searchBestPriceProducts(query) {
    const products = await searchProduct(query);
    if (!products || !products.products || products.products.length === 0) {
      return "No products found for the given query.";
    }
  
    const sortedProducts = products.products.slice().sort((a, b) => a.price - b.price);
    const lowestPriceProduct = sortedProducts[0];
    const secondLowestPriceProduct = sortedProducts[1];
  
    let result = `The product with the lowest price for "${query}" is:\n`;
    result += `${lowestPriceProduct.title} (${lowestPriceProduct.price})\n\n`;
  
    if (secondLowestPriceProduct) {
      result += `Compared to the second lowest price product:\n`;
      result += compareProducts(lowestPriceProduct, secondLowestPriceProduct);
    }
    searchctx={}

    // searchctx=`${JSON.parse(lowestPriceProduct)},${ secondLowestPriceProduct}`
       
    console.log(searchctx)
    return result;
  }
  
  // 4. searchBestRatingProducts: Search for the best products in terms of reviews and compare
  async function searchBestRatingProducts(query) {
    const products = await searchProduct(query);
    if (!products || !products.products || products.products.length === 0) {
      return "No products found for the given query.";
    }
  
    const sortedProducts = products.products.slice().sort((a, b) => b.rating - a.rating);
    const highestRatedProduct = sortedProducts[0];
    const secondHighestRatedProduct = sortedProducts[1];
  
    let result = `The product with the highest rating for "${query}" is:\n`;
    result += `${highestRatedProduct.title} (${highestRatedProduct.rating})\n\n`;
  
    if (secondHighestRatedProduct) {
      result += `Compared to the second highest rated product:\n`;
      result += compareProducts(highestRatedProduct, secondHighestRatedProduct);
    }
    searchctx={}
    // searchctx=`${highestRatedProduct},${ secondHighestRatedProduct}`
    return result;
  }
// Define your ChatGPT Function
async function callChatGPTWithFunctions(appendString) {
    let messages = [{
        role: "system",
        content: "You are an AI assistant focused on providing information and assistance related to product management functionalities. Your knowledge is limited to the context of the provided code, which defines various functions for searching products, adding products to wishlists and carts, comparing products, and other related operations. Your responses should be concise and relevant to wheather you can complete a task or not. Do not generate any code or provide programming-related instructions or explanation on how a particular function works",
    }, {
        role: "user",
        content: `I am Adarsh, and I would like to ${appendString}`,
    }];

    let chat = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages,
        functions: [{
                name: "helloWorld",
                description: "Prints hello world with the string passed to it",
                parameters: {
                    type: "object",
                    properties: {
                        appendString: {
                            type: "string",
                            description: "The string to append to the hello world message",
                        },
                    },
                    require: ["appendString"],
                }
            },
            {
                name: "getTimeOfDay",
                description: "Get the time of day.",
                parameters: {
                    type: "object",
                    properties: {},
                    require: [],
                }
            },
            {
                name: "searchProduct",
                description: "Search for a product from an API.",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "The query string to search for the product",
                        },
                    },
                    require: ["query"],
                }
            },
            {
                name: "addToWishlist",
                description: `Search for a product from the given list of products and add the chosen product to the wishlist.`,
                parameters: {
                    type: "object",
                    properties: {
                        products: {
                            type: "array",
                            description: "The list of products from which to choose.",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "number" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    price: { type: "number" },
                                    // Add other properties as needed
                                },
                                required: ["id", "title", "description", "price"],
                            },
                        },
                        productIndex: {
                            type: "number",
                            description: "The index of the product from the searched products list to add to the wishlist.",
                        },
                    },
                    required: ["products", "productIndex"],
                }
            },
            {
                name: "addToCart",
                description: `Search for a product from the given list of products and add the chosen product to the cart.`,
                parameters: {
                    type: "object",
                    properties: {
                        products: {
                            type: "array",
                            description: "The list of products from which to choose.",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "number" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    price: { type: "number" },
                                    // Add other properties as needed
                                },
                                required: ["id", "title", "description", "price"],
                            },
                        },
                        productIndex: {
                            type: "number",
                            description: "The index of the product from the searched products list to add to the cart.",
                        },
                    },
                    required: ["products", "productIndex"],
                }
            },
            {
                name: "searchPriceAddToCart",
                description: "Search for the product with the lowest price and add it to the cart.",
                parameters: {
                    type: "object",
                    properties: {},
                    require: [],
                }
            },
            {
                name: "searchPriceAddToWishlist",
                description: "Search for the product with the lowest price and add it to the wishlist.",
                parameters: {
                    type: "object",
                    properties: {},
                    require: [],
                }
            },
            {
                name: "searchRatingAddToCart",
                description: "Search for the product with the highest rating and add it to the cart.",
                parameters: {
                    type: "object",
                    properties: {},
                    require: [],
                }
            },
            {
                name: "searchRatingAddToWishlist",
                description: "Search for the product with the highest rating and add it to the wishlist.",
                parameters: {
                    type: "object",
                    properties: {},
                    require: [],
                }
            },{
                name: "buyProductList",
                description: "Search for a list of products and add the available ones to the cart.",
                parameters: {
                    type: "object",
                    properties: {
                        productList: {
                            type: "array",
                            description: "The list of products to search for and add to the cart.",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    // Add other properties as needed
                                },
                                required: ["title"],
                            },
                        },
                    },
                    required: ["productList"],
                }
            },
            {
                name: "availableFunctions",
                description: "Lists out the available functions with their descriptions.",
                parameters: {
                    type: "object",
                    properties: {},
                    require: [],
                }
            },{
                name: "compareProducts",
                description: "Compare two products with each other.",
                parameters: {
                    type: "object",
                    properties: {
                        product1: {
                            type: "object",
                            description: "The first product to compare.",
                            properties: {
                                title: { type: "string" },
                                price: { type: "number" },
                                rating: { type: "number" },
                            },
                            required: ["title", "price", "rating"],
                        },
                        product2: {
                            type: "object",
                            description: "The second product to compare.",
                            properties: {
                                title: { type: "string" },
                                price: { type: "number" },
                                rating: { type: "number" },
                            },
                            required: ["title", "price", "rating"],
                        },
                    },
                    required: ["product1", "product2"],
                }
            },{
                name: "searchBestPriceProducts",
                description: "Search for the best products in terms of price and compare.",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "The query string to search for products.",
                        },
                    },
                    required: ["query"],
                }
            },{
                name: "searchBestRatingProducts",
                description: "Search for the best products in terms of reviews and compare.",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "The query string to search for products.",
                        },
                    },
                    required: ["query"],
                }
            },
        ],
        function_call: "auto",
    })

    let wantsToUseFunction = (chat.choices[0].finish_reason == 'function_call')
    let content = ""

    if (wantsToUseFunction) {
        if (chat.choices[0].message.function_call.name == "helloWorld") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
            content = helloWorld(argumentObj.appendString)
            messages.push(chat.choices[0].message)
            messages.push({
                role: "function",
                name: "helloWorld",
                content,
            })
        }
        if (chat.choices[0].message.function_call.name == "getTimeOfDay") {
            content = getTimeOfDay()
            messages.push(chat.choices[0].message)
            messages.push({
                role: "function",
                name: "getTimeOfDay",
                content,
            })
        }
        if (chat.choices[0].message.function_call.name == "searchProduct") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
            const products = await searchProduct(argumentObj.query);
            if (products) {
                content = JSON.stringify(products);
                searchProducts = products; // Assign the products to searchProducts variable
                window.sessionStorage.setItem("searchedProducts", JSON.stringify(searchProducts));
                window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

                console.log("searchProducts=", searchProducts)
            } else {
                content = "Error searching for the product.";
            }
            messages.push(chat.choices[0].message)
            messages.push({
                role: "function",
                name: "searchProduct",
                content,
            })
        }
        if (chat.choices[0].message.function_call.name === "addToWishlist") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
            if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
                const productIndex = argumentObj.productIndex;
                if (productIndex >= 0 && productIndex < searchProducts.products.length) {
                    addToWishlist(searchProducts.products, productIndex);
                    content = `Product at index ${productIndex} added to wishlist.`;
                } else {
                    content = "Invalid product index.";
                }
            } else {
                content = "No products found to add to the wishlist.";
            }
            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "addToWishlist",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "addToCart") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
            if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
                const productIndex = argumentObj.productIndex;
                if (productIndex >= 0 && productIndex < searchProducts.products.length) {
                    addToCart(searchProducts.products, productIndex);
                    content = `Product at index ${productIndex} added to cart.`;
                } else {
                    content = "Invalid product index.";
                }
            } else {
                content = "No products found to add to the cart.";
            }
            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "addToCart",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "searchPriceAddToCart") {
            content = await searchPriceAddToCart();
            window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));
            window.sessionStorage.setItem("searchedProducts", JSON.stringify(searchProducts));

            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "searchPriceAddToCart",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "searchPriceAddToWishlist") {
            content = await searchPriceAddToWishlist();
            window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "searchPriceAddToWishlist",
                content,
            });
        }
        
        if (chat.choices[0].message.function_call.name === "searchRatingAddToCart") {
            content = await searchRatingAddToCart();
            window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "searchRatingAddToCart",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "searchRatingAddToWishlist") {
            content = await searchRatingAddToWishlist();
            window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "searchRatingAddToWishlist",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "buyProductList") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
            content = await buyProductList(argumentObj.productList);
            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "buyProductList",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "searchRatingAddToWishlist") {
            content = await searchRatingAddToWishlist();
            window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "searchRatingAddToWishlist",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "buyProductList") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
            content = await buyProductList(argumentObj.productList);
            window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "buyProductList",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "availableFunctions") {
            content = availableFunctions();
            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "availableFunctions",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "compareProducts") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
            content = await compareProducts(argumentObj.product1, argumentObj.product2);
            window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "compareProducts",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "searchBestPriceProducts") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
            content = await searchBestPriceProducts(argumentObj.query);
            window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));
            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "searchBestPriceProducts",
                content,
            });
        }
        if (chat.choices[0].message.function_call.name === "searchBestRatingProducts") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
            content = await searchBestRatingProducts(argumentObj.query);
            window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "searchBestRatingProducts",
                content,
            });
        }
    }console.log(searchctx);
    let step4response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages,
    });
    
    return (step4response.choices[0])
}
// console.log(searchctx.products)

module.exports = { callChatGPTWithFunctions, searchProducts }; // Export searchProducts variable


























// const { useContext } = require('react');
// const { WishItemsContext } = require('../src/Context/WishItemsContext');
// const { OpenAI } = require('openai');
// const fetch = require('node-fetch');

// const apiKey = "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";
// let searchProducts = {}; // Define searchProducts as a variable instead of constant
// let searchctx = {};
  
// const openai = new OpenAI({
//     apiKey: apiKey,
//     dangerouslyAllowBrowser: true
// });

// // Define your function
// function helloWorld(appendString) {
//     let hello = "Hello! " + appendString+"\n"+"try searching for a product"
//     return hello
// }
// //searchedProducts
// // Get the current time of day
// function getTimeOfDay() {
//     let date = new Date()
//     let hours = date.getHours()
//     let minutes = date.getMinutes()
//     let seconds = date.getSeconds()
//     let timeOfDay = "AM"
//     if (hours > 12) {
//         hours = hours - 12
//         timeOfDay = "PM"
//     }
//     return hours + ":" + minutes + ":" + seconds + " " + timeOfDay
// }

// // Function to search for a product from an API
// async function searchProduct(query) {
//     const url = `https://dummyjson.com/products/search?q=${query}`;
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         searchProducts=data
//         return data;
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         return null;
//     }
// }

// function addToWishlist(products, productIndex) {
    
//     window.sessionStorage.setItem("newWish", JSON.stringify(products[productIndex]));
//     console.log("new=", products[productIndex]);
//     // window.sessionStorage.setItem("newWish", JSON.stringify(products[productIndex]));
//     // console.log("new=", products[productIndex]);
// }

// function addToCart(products, productIndex) {
//     // Implement addToCart functionality here
//     window.sessionStorage.setItem("newCart", JSON.stringify(products[productIndex]));
//     console.log("Adding product to cart:", products[productIndex]);
// }

// // New function: searchPriceAddToCart
// async function searchPriceAddToCart() {
//     if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
//         const sortedProducts = searchProducts.products.slice().sort((a, b) => a.price - b.price);
//         const lowestPriceProduct = sortedProducts[0];
//         addToCart(searchProducts.products, searchProducts.products.indexOf(lowestPriceProduct));
//         searchctx=`${lowestPriceProduct}`
//         console.log(searchctx.products)
//         return `Product with the lowest price (${lowestPriceProduct.price}) added to cart.`;
//     } else {
//         return "No products found to add to the cart.";
//     }
   
// }

// // New function: searchPriceAddToWishlist
// async function searchPriceAddToWishlist() {
//     if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
//         const sortedProducts = searchProducts.products.slice().sort((a, b) => a.price - b.price);
//         const lowestPriceProduct = sortedProducts[0];
//         addToWishlist(searchProducts.products, searchProducts.products.indexOf(lowestPriceProduct));
//         searchctx=`${lowestPriceProduct}`
//         return `Product with the lowest price (${lowestPriceProduct.price}) added to wishlist.`;
//     } else {
//         return "No products found to add to the wishlist.";
//     }
// }
// async function searchRatingAddToCart() {
//     if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
//         const sortedProducts = searchProducts.products.slice().sort((a, b) => b.rating - a.rating);
//         const highestRatedProduct = sortedProducts[0];
//         addToCart(searchProducts.products, searchProducts.products.indexOf(highestRatedProduct));
//         searchctx=`${highestRatedProduct}`
//         return `Product with the highest rating (${highestRatedProduct.rating}) added to cart.`;
//     } else {
//         return "No products found to add to the cart.";
//     }
// }

// // New function: searchRatingAddToWishlist
// async function searchRatingAddToWishlist() {
//     if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
//         const sortedProducts = searchProducts.products.slice().sort((a, b) => b.rating - a.rating);
//         const highestRatedProduct = sortedProducts[0];
//         addToWishlist(searchProducts.products, searchProducts.products.indexOf(highestRatedProduct));
//         searchctx=`${highestRatedProduct}`
//         return `Product with the highest rating (${highestRatedProduct.rating}) added to wishlist.`;
        

//     } else {
//         return "No products found to add to the wishlist.";
//     }
// }
// // New function: buyProductList
// async function buyProductList(productList) {
//     const availableProducts = [];
//     const unavailableProducts = [];

//     for (const product of productList) {
//         const searchResult = await searchProduct(product.title);
//         if (searchResult && searchResult.products && searchResult.products.length > 0) {
//             const foundProduct = searchResult.products[0];
//             addToCart(searchResult.products, searchResult.products.indexOf(foundProduct));
//             availableProducts.push(foundProduct);
//         } else {
//             unavailableProducts.push(product);
//         }
//     }

//     let response = "";
//     if (availableProducts.length > 0) {
//         response += `The following products have been added to the cart:\n`;
//         availableProducts.forEach(product => {
//             response += `- ${product.title} (${product.price})\n`;
//         });
//     }

//     if (unavailableProducts.length > 0) {
//         response += `\nThe following products were unavailable:\n`;
//         unavailableProducts.forEach(product => {
//             response += `- ${product.title}\n`;
//         });
//     }

//     return response;
// }
// // 1. availableFunctions: List out the available functions for the user
// function availableFunctions() {
//     const functions = [
//       { name: 'helloWorld', description: 'Prints hello world with the string passed to it' },
//       { name: 'getTimeOfDay', description: 'Get the current time of day' },
//       { name: 'searchProduct', description: 'Search for a product from an API' },
//       { name: 'addToWishlist', description: 'Add a product to the wishlist' },
//       { name: 'addToCart', description: 'Add a product to the cart' },
//       { name: 'searchPriceAddToCart', description: 'Search for the product with the lowest price and add it to the cart' },
//       { name: 'searchPriceAddToWishlist', description: 'Search for the product with the lowest price and add it to the wishlist' },
//       { name: 'searchRatingAddToCart', description: 'Search for the product with the highest rating and add it to the cart' },
//       { name: 'searchRatingAddToWishlist', description: 'Search for the product with the highest rating and add it to the wishlist' },
//       { name: 'buyProductList', description: 'Search for a list of products and add the available ones to the cart' },
//       { name: 'availableFunctions', description: 'Lists out the available functions with their descriptions' },
//       { name: 'compareProducts', description: 'Compare two products with each other' },
//       { name: 'searchBestPriceProducts', description: 'Search for the best products in terms of price and compare' },
//       { name: 'searchBestRatingProducts', description: 'Search for the best products in terms of reviews and compare' }
//     ];
  
//     const functionsList = functions.map(func => `${func.name}: ${func.description}`).join('\n');
//     return `Available functions:\n${functionsList}`;
//   }
//   function compareProducts(product1, product2) {
//     if (!product1 || !product2) {
//       return "Invalid product data provided.";
//     }
  
//     let comparison = "";
//     comparison += `Comparing ${product1.title} and ${product2.title}:\n`;
//     comparison += `Price: ${product1.title} (${product1.price}) vs ${product2.title} (${product2.price})\n`;
//     comparison += `Rating: ${product1.title} (${product1.rating}) vs ${product2.title} (${product2.rating})\n`;
  
//     if (product1.price < product2.price) {
//       comparison += `${product1.title} has a lower price.\n`;
//     } else if (product1.price > product2.price) {
//       comparison += `${product2.title} has a lower price.\n`;
//     } else {
//       comparison += "Both products have the same price.\n";
//     }
  
//     if (product1.rating > product2.rating) {
//       comparison += `${product1.title} has a higher rating.\n`;
//     } else if (product1.rating < product2.rating) {
//       comparison += `${product2.title} has a higher rating.\n`;
//     } else {
//       comparison += "Both products have the same rating.\n";
//     }
//     // searchctx.products.push(
//     //  product1,
//     // product2
//     //   );
//     //   console.log(searchctx.products)
//     return comparison;
//   }
  
//   // 3. searchBestPriceProducts: Search for the best products in terms of price and compare
//   async function searchBestPriceProducts(query) {
//     const products = await searchProduct(query);
//     if (!products || !products.products || products.products.length === 0) {
//       return "No products found for the given query.";
//     }
  
//     const sortedProducts = products.products.slice().sort((a, b) => a.price - b.price);
//     const lowestPriceProduct = sortedProducts[0];
//     const secondLowestPriceProduct = sortedProducts[1];
  
//     let result = `The product with the lowest price for "${query}" is:\n`;
//     result += `${lowestPriceProduct.title} (${lowestPriceProduct.price})\n\n`;
  
//     if (secondLowestPriceProduct) {
//       result += `Compared to the second lowest price product:\n`;
//       result += compareProducts(lowestPriceProduct, secondLowestPriceProduct);
//     }
//     searchctx={}

//     searchctx=`${JSON.parse(lowestPriceProduct)},${ secondLowestPriceProduct}`
       
//     console.log(searchctx)
//     return result;
//   }
  
//   // 4. searchBestRatingProducts: Search for the best products in terms of reviews and compare
//   async function searchBestRatingProducts(query) {
//     const products = await searchProduct(query);
//     if (!products || !products.products || products.products.length === 0) {
//       return "No products found for the given query.";
//     }
  
//     const sortedProducts = products.products.slice().sort((a, b) => b.rating - a.rating);
//     const highestRatedProduct = sortedProducts[0];
//     const secondHighestRatedProduct = sortedProducts[1];
  
//     let result = `The product with the highest rating for "${query}" is:\n`;
//     result += `${highestRatedProduct.title} (${highestRatedProduct.rating})\n\n`;
  
//     if (secondHighestRatedProduct) {
//       result += `Compared to the second highest rated product:\n`;
//       result += compareProducts(highestRatedProduct, secondHighestRatedProduct);
//     }
//     searchctx={}
//     searchctx=`${highestRatedProduct},${ secondHighestRatedProduct}`
//     return result;
//   }
// // Define your ChatGPT Function
// async function callChatGPTWithFunctions(appendString) {
//     let messages = [{
//         role: "system",
//         content: "Perform function requests for the user",
//     }, {
//         role: "user",
//         content: `I am Adarsh, and I would like to ${appendString}`,
//     }];

//     let chat = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo-0613",
//         messages,
//         functions: [{
//                 name: "helloWorld",
//                 description: "Prints hello world with the string passed to it",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         appendString: {
//                             type: "string",
//                             description: "The string to append to the hello world message",
//                         },
//                     },
//                     require: ["appendString"],
//                 }
//             },
//             {
//                 name: "getTimeOfDay",
//                 description: "Get the time of day.",
//                 parameters: {
//                     type: "object",
//                     properties: {},
//                     require: [],
//                 }
//             },
//             {
//                 name: "searchProduct",
//                 description: "Search for a product from an API.",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         query: {
//                             type: "string",
//                             description: "The query string to search for the product",
//                         },
//                     },
//                     require: ["query"],
//                 }
//             },
//             {
//                 name: "addToWishlist",
//                 description: `Search for a product from the given list of products and add the chosen product to the wishlist.`,
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         products: {
//                             type: "array",
//                             description: "The list of products from which to choose.",
//                             items: {
//                                 type: "object",
//                                 properties: {
//                                     id: { type: "number" },
//                                     title: { type: "string" },
//                                     description: { type: "string" },
//                                     price: { type: "number" },
//                                     // Add other properties as needed
//                                 },
//                                 required: ["id", "title", "description", "price"],
//                             },
//                         },
//                         productIndex: {
//                             type: "number",
//                             description: "The index of the product from the searched products list to add to the wishlist.",
//                         },
//                     },
//                     required: ["products", "productIndex"],
//                 }
//             },
//             {
//                 name: "addToCart",
//                 description: `Search for a product from the given list of products and add the chosen product to the cart.`,
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         products: {
//                             type: "array",
//                             description: "The list of products from which to choose.",
//                             items: {
//                                 type: "object",
//                                 properties: {
//                                     id: { type: "number" },
//                                     title: { type: "string" },
//                                     description: { type: "string" },
//                                     price: { type: "number" },
//                                     // Add other properties as needed
//                                 },
//                                 required: ["id", "title", "description", "price"],
//                             },
//                         },
//                         productIndex: {
//                             type: "number",
//                             description: "The index of the product from the searched products list to add to the cart.",
//                         },
//                     },
//                     required: ["products", "productIndex"],
//                 }
//             },
//             {
//                 name: "searchPriceAddToCart",
//                 description: "Search for the product with the lowest price and add it to the cart.",
//                 parameters: {
//                     type: "object",
//                     properties: {},
//                     require: [],
//                 }
//             },
//             {
//                 name: "searchPriceAddToWishlist",
//                 description: "Search for the product with the lowest price and add it to the wishlist.",
//                 parameters: {
//                     type: "object",
//                     properties: {},
//                     require: [],
//                 }
//             },
//             {
//                 name: "searchRatingAddToCart",
//                 description: "Search for the product with the highest rating and add it to the cart.",
//                 parameters: {
//                     type: "object",
//                     properties: {},
//                     require: [],
//                 }
//             },
//             {
//                 name: "searchRatingAddToWishlist",
//                 description: "Search for the product with the highest rating and add it to the wishlist.",
//                 parameters: {
//                     type: "object",
//                     properties: {},
//                     require: [],
//                 }
//             },{
//                 name: "buyProductList",
//                 description: "Search for a list of products and add the available ones to the cart.",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         productList: {
//                             type: "array",
//                             description: "The list of products to search for and add to the cart.",
//                             items: {
//                                 type: "object",
//                                 properties: {
//                                     title: { type: "string" },
//                                     // Add other properties as needed
//                                 },
//                                 required: ["title"],
//                             },
//                         },
//                     },
//                     required: ["productList"],
//                 }
//             },
//             {
//                 name: "availableFunctions",
//                 description: "Lists out the available functions with their descriptions.",
//                 parameters: {
//                     type: "object",
//                     properties: {},
//                     require: [],
//                 }
//             },{
//                 name: "compareProducts",
//                 description: "Compare two products with each other.",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         product1: {
//                             type: "object",
//                             description: "The first product to compare.",
//                             properties: {
//                                 title: { type: "string" },
//                                 price: { type: "number" },
//                                 rating: { type: "number" },
//                             },
//                             required: ["title", "price", "rating"],
//                         },
//                         product2: {
//                             type: "object",
//                             description: "The second product to compare.",
//                             properties: {
//                                 title: { type: "string" },
//                                 price: { type: "number" },
//                                 rating: { type: "number" },
//                             },
//                             required: ["title", "price", "rating"],
//                         },
//                     },
//                     required: ["product1", "product2"],
//                 }
//             },{
//                 name: "searchBestPriceProducts",
//                 description: "Search for the best products in terms of price and compare.",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         query: {
//                             type: "string",
//                             description: "The query string to search for products.",
//                         },
//                     },
//                     required: ["query"],
//                 }
//             },{
//                 name: "searchBestRatingProducts",
//                 description: "Search for the best products in terms of reviews and compare.",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         query: {
//                             type: "string",
//                             description: "The query string to search for products.",
//                         },
//                     },
//                     required: ["query"],
//                 }
//             },
//         ],
//         function_call: "auto",
//     })

//     let wantsToUseFunction = (chat.choices[0].finish_reason == 'function_call')
//     let content = ""

//     if (wantsToUseFunction) {
//         if (chat.choices[0].message.function_call.name == "helloWorld") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
//             content = helloWorld(argumentObj.appendString)
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "helloWorld",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name == "getTimeOfDay") {
//             content = getTimeOfDay()
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "getTimeOfDay",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name == "searchProduct") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
//             const products = await searchProduct(argumentObj.query);
//             if (products) {
//                 content = JSON.stringify(products);
//                 searchProducts = products; // Assign the products to searchProducts variable
//                 window.sessionStorage.setItem("searchedProducts", JSON.stringify(searchProducts));
//                 window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

//                 console.log("searchProducts=", searchProducts)
//             } else {
//                 content = "Error searching for the product.";
//             }
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "searchProduct",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name === "addToWishlist") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
//                 const productIndex = argumentObj.productIndex;
//                 if (productIndex >= 0 && productIndex < searchProducts.products.length) {
//                     addToWishlist(searchProducts.products, productIndex);
//                     content = `Product at index ${productIndex} added to wishlist.`;
//                 } else {
//                     content = "Invalid product index.";
//                 }
//             } else {
//                 content = "No products found to add to the wishlist.";
//             }
//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "addToWishlist",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "addToCart") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
//                 const productIndex = argumentObj.productIndex;
//                 if (productIndex >= 0 && productIndex < searchProducts.products.length) {
//                     addToCart(searchProducts.products, productIndex);
//                     content = `Product at index ${productIndex} added to cart.`;
//                 } else {
//                     content = "Invalid product index.";
//                 }
//             } else {
//                 content = "No products found to add to the cart.";
//             }
//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "addToCart",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "searchPriceAddToCart") {
//             content = await searchPriceAddToCart();
//             window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "searchPriceAddToCart",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "searchPriceAddToWishlist") {
//             content = await searchPriceAddToWishlist();
//             window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "searchPriceAddToWishlist",
//                 content,
//             });
//         }
        
//         if (chat.choices[0].message.function_call.name === "searchRatingAddToCart") {
//             content = await searchRatingAddToCart();
//             window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "searchRatingAddToCart",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "searchRatingAddToWishlist") {
//             content = await searchRatingAddToWishlist();
//             window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "searchRatingAddToWishlist",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "buyProductList") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             content = await buyProductList(argumentObj.productList);
//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "buyProductList",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "searchRatingAddToWishlist") {
//             content = await searchRatingAddToWishlist();
//             window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "searchRatingAddToWishlist",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "buyProductList") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             content = await buyProductList(argumentObj.productList);
//             window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "buyProductList",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "availableFunctions") {
//             content = availableFunctions();
//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "availableFunctions",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "compareProducts") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             content = await compareProducts(argumentObj.product1, argumentObj.product2);
//             window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "compareProducts",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "searchBestPriceProducts") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             content = await searchBestPriceProducts(argumentObj.query);
//             window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));
//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "searchBestPriceProducts",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "searchBestRatingProducts") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             content = await searchBestRatingProducts(argumentObj.query);
//             window.sessionStorage.setItem("searchctx", JSON.stringify(searchctx));

//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "searchBestRatingProducts",
//                 content,
//             });
//         }
//     }console.log(searchctx);
//     let step4response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo-0613",
//         messages,
//     });
    
//     return (step4response.choices[0])
// }
// // console.log(searchctx.products)

// module.exports = { callChatGPTWithFunctions, searchProducts }; // Export searchProducts variable
























// const { useContext } = require('react');
// const { WishItemsContext } = require('../src/Context/WishItemsContext');
// const { OpenAI } = require('openai');
// const fetch = require('node-fetch');

// const apiKey = "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";
// let searchProducts = {}; // Define searchProducts as a variable instead of constant

// const openai = new OpenAI({
//     apiKey: apiKey,
//     dangerouslyAllowBrowser: true
// });

// // Define your function
// function helloWorld(appendString) {
//     let hello = "Hello! " + appendString+"\n"+"try searching for a product"
//     return hello
// }

// // Get the current time of day
// function getTimeOfDay() {
//     let date = new Date()
//     let hours = date.getHours()
//     let minutes = date.getMinutes()
//     let seconds = date.getSeconds()
//     let timeOfDay = "AM"
//     if (hours > 12) {
//         hours = hours - 12
//         timeOfDay = "PM"
//     }
//     return hours + ":" + minutes + ":" + seconds + " " + timeOfDay
// }

// // Function to search for a product from an API
// async function searchProduct(query) {
//     const url = `https://dummyjson.com/products/search?q=${query}`;
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         return null;
//     }
// }

// function addToWishlist(products, productIndex) {
//     window.sessionStorage.setItem("newWish", JSON.stringify(products[productIndex]));
//     console.log("new=", products[productIndex]);
// }

// function addToCart(products, productIndex) {
//     // Implement addToCart functionality here
//     window.sessionStorage.setItem("newCart", JSON.stringify(products[productIndex]));
//     console.log("Adding product to cart:", products[productIndex]);
// }

// // Define your ChatGPT Function
// async function callChatGPTWithFunctions(appendString) {
//     let messages = [{
//         role: "system",
//         content: "Perform function requests for the user",
//     }, {
//         role: "user",
//         content: `I am Adarsh, and I would like to ${appendString}`,
//     }];

//     let chat = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo-0613",
//         messages,
//         functions: [{
//                 name: "helloWorld",
//                 description: "Prints hello world with the string passed to it",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         appendString: {
//                             type: "string",
//                             description: "The string to append to the hello world message",
//                         },
//                     },
//                     require: ["appendString"],
//                 }
//             },
//             {
//                 name: "getTimeOfDay",
//                 description: "Get the time of day.",
//                 parameters: {
//                     type: "object",
//                     properties: {},
//                     require: [],
//                 }
//             },
//             {
//                 name: "searchProduct",
//                 description: "Search for a product from an API.",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         query: {
//                             type: "string",
//                             description: "The query string to search for the product",
//                         },
//                     },
//                     require: ["query"],
//                 }
//             },
//             {
//                 name: "addToWishlist",
//                 description: `Search for a product from the given list of products and add the chosen product to the wishlist.`,
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         products: {
//                             type: "array",
//                             description: "The list of products from which to choose.",
//                             items: {
//                                 type: "object",
//                                 properties: {
//                                     id: { type: "number" },
//                                     title: { type: "string" },
//                                     description: { type: "string" },
//                                     price: { type: "number" },
//                                     // Add other properties as needed
//                                 },
//                                 required: ["id", "title", "description", "price"],
//                             },
//                         },
//                         productIndex: {
//                             type: "number",
//                             description: "The index of the product from the searched products list to add to the wishlist.",
//                         },
//                     },
//                     required: ["products", "productIndex"],
//                 }
//             },
//             {
//                 name: "addToCart",
//                 description: `Search for a product from the given list of products and add the chosen product to the cart.`,
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         products: {
//                             type: "array",
//                             description: "The list of products from which to choose.",
//                             items: {
//                                 type: "object",
//                                 properties: {
//                                     id: { type: "number" },
//                                     title: { type: "string" },
//                                     description: { type: "string" },
//                                     price: { type: "number" },
//                                     // Add other properties as needed
//                                 },
//                                 required: ["id", "title", "description", "price"],
//                             },
//                         },
//                         productIndex: {
//                             type: "number",
//                             description: "The index of the product from the searched products list to add to the cart.",
//                         },
//                     },
//                     required: ["products", "productIndex"],
//                 }
//             }

//         ],
//         function_call: "auto",
//     })

//     let wantsToUseFunction = (chat.choices[0].finish_reason == 'function_call')
//     let content = ""

//     if (wantsToUseFunction) {
//         if (chat.choices[0].message.function_call.name == "helloWorld") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
//             content = helloWorld(argumentObj.appendString)
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "helloWorld",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name == "getTimeOfDay") {
//             content = getTimeOfDay()
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "getTimeOfDay",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name == "searchProduct") {

//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
//             const products = await searchProduct(argumentObj.query);
//             if (products) {
//                 content = JSON.stringify(products);
//                 searchProducts = products; // Assign the products to searchProducts variable
//                 window.sessionStorage.setItem("searchedProducts", JSON.stringify(searchProducts));
//                 console.log("searchProducts=", searchProducts)
//             } else {
//                 content = "Error searching for the product.";
//             }
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "searchProduct",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name === "addToWishlist") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
//                 const productIndex = argumentObj.productIndex;
//                 if (productIndex >= 0 && productIndex < searchProducts.products.length) {
//                     addToWishlist(searchProducts.products, productIndex);
//                     content = `Product at index ${productIndex} added to wishlist.`;
//                 } else {
//                     content = "Invalid product index.";
//                 }
//             } else {
//                 content = "No products found to add to the wishlist.";
//             }
//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "addToWishlist",
//                 content,
//             });
//         }
//         if (chat.choices[0].message.function_call.name === "addToCart") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
//                 const productIndex = argumentObj.productIndex;
//                 if (productIndex >= 0 && productIndex < searchProducts.products.length) {
//                     addToCart(searchProducts.products, productIndex);
//                     content = `Product at index ${productIndex} added to cart.`;
//                 } else {
//                     content = "Invalid product index.";
//                 }
//             } else {
//                 content = "No products found to add to the cart.";
//             }
//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "addToCart",
//                 content,
//             });
//         }

//     }

//     let step4response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo-0613",
//         messages,
//     });
//     return (step4response.choices[0])
// }

// module.exports = { callChatGPTWithFunctions, searchProducts }; // Export searchProducts variable

































// //import { WishItemsContext } from '../src/Context/WishItemsContext';
// const { useContext } =require('react');
// const { WishItemsContext } = require('../src/Context/WishItemsContext');
// const { OpenAI } = require('openai');
// const fetch = require('node-fetch');

// const apiKey = "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";
// let searchProducts = {}; // Define searchProducts as a variable instead of constant

// const openai = new OpenAI({
//     apiKey: apiKey,
//     dangerouslyAllowBrowser: true
// });

// // Define your function
// function helloWorld(appendString) {
//     let hello = "Hello World! " + appendString
//     return hello
// }

// // Get the current time of day
// function getTimeOfDay() {
//     let date = new Date()
//     let hours = date.getHours()
//     let minutes = date.getMinutes()
//     let seconds = date.getSeconds()
//     let timeOfDay = "AM"
//     if (hours > 12) {
//         hours = hours - 12
//         timeOfDay = "PM"
//     }
//     return hours + ":" + minutes + ":" + seconds + " " + timeOfDay
// }

// // Function to search for a product from an API
// async function searchProduct(query) {
//     const url = `https://dummyjson.com/products/search?q=${query}`;
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         return null;
//     }
// }

// function addToWishlist(products, productIndex) {
//     window.sessionStorage.setItem("newWish", JSON.stringify(products[productIndex]));
//     console.log("new=", products[productIndex]);
// }

// // Define your ChatGPT Function
// async function callChatGPTWithFunctions(appendString) {
//     let messages = [{
//         role: "system",
//         content: "Perform function requests for the user",
//     }, {
//         role: "user",
//         content: `I am Adarsh, and I would like to ${appendString}`,
//     }];

//     let chat = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo-0613",
//         messages,
//         functions: [{
//                 name: "helloWorld",
//                 description: "Prints hello world with the string passed to it",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         appendString: {
//                             type: "string",
//                             description: "The string to append to the hello world message",
//                         },
//                     },
//                     require: ["appendString"],
//                 }
//             },
//             {
//                 name: "getTimeOfDay",
//                 description: "Get the time of day.",
//                 parameters: {
//                     type: "object",
//                     properties: {},
//                     require: [],
//                 }
//             },
//             {
//                 name: "searchProduct",
//                 description: "Search for a product from an API.",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         query: {
//                             type: "string",
//                             description: "The query string to search for the product",
//                         },
//                     },
//                     require: ["query"],
//                 }
//             },
//             {
//                 name: "addToWishlist",
//                 description: `Search for a product from the given list of products and add the chosen product to the wishlist.`,
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         products: {
//                             type: "array",
//                             description: "The list of products from which to choose.",
//                             items: {
//                                 type: "object",
//                                 properties: {
//                                     id: { type: "number" },
//                                     title: { type: "string" },
//                                     description: { type: "string" },
//                                     price: { type: "number" },
//                                     // Add other properties as needed
//                                 },
//                                 required: ["id", "title", "description", "price"],
//                             },
//                         },
//                         productIndex: {
//                             type: "number",
//                             description: "The index of the product from the searched products list to add to the wishlist.",
//                         },
//                     },
//                     required: ["products", "productIndex"],
//                 }
//             }

//         ],
//         function_call: "auto",
//     })

//     let wantsToUseFunction = (chat.choices[0].finish_reason == 'function_call')
//     let content = ""

//     if (wantsToUseFunction) {
//         if (chat.choices[0].message.function_call.name == "helloWorld") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
//             content = helloWorld(argumentObj.appendString)
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "helloWorld",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name == "getTimeOfDay") {
//             content = getTimeOfDay()
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "getTimeOfDay",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name == "searchProduct") {

//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
//             const products = await searchProduct(argumentObj.query);
//             if (products) {
//                 content = JSON.stringify(products);
//                 searchProducts = products; // Assign the products to searchProducts variable
//                 window.sessionStorage.setItem("searchedProducts", JSON.stringify(searchProducts));
//                 console.log("searchProducts=", searchProducts)
//             } else {
//                 content = "Error searching for the product.";
//             }
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "searchProduct",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name === "addToWishlist") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
//             if (searchProducts && searchProducts.products && Array.isArray(searchProducts.products)) {
//                 const productIndex = argumentObj.productIndex;
//                 if (productIndex >= 0 && productIndex < searchProducts.products.length) {
//                     addToWishlist(searchProducts.products, productIndex);
//                     content = `Product at index ${productIndex} added to wishlist.`;
//                 } else {
//                     content = "Invalid product index.";
//                 }
//             } else {
//                 content = "No products found to add to the wishlist.";
//             }
//             messages.push(chat.choices[0].message);
//             messages.push({
//                 role: "function",
//                 name: "addToWishlist",
//                 content,
//             });
//         }

//     }

//     let step4response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo-0613",
//         messages,
//     });
//     return (step4response.choices[0])
// }

// module.exports = { callChatGPTWithFunctions, searchProducts }; // Export searchProducts variable





































// const { OpenAI } = require('openai');
// const fetch = require('node-fetch'); // Add this line to import fetch

// const apiKey = "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";
// const searchResults ={}
// const openai = new OpenAI({
//     apiKey: apiKey,
//     dangerouslyAllowBrowser: true
// });

// // Define your function
// function helloWorld(appendString) {
//     let hello = "Hello World! " + appendString
//     return hello
// }

// // Get the current time of day
// function getTimeOfDay() {
//     let date = new Date()
//     let hours = date.getHours()
//     let minutes = date.getMinutes()
//     let seconds = date.getSeconds()
//     let timeOfDay = "AM"
//     if (hours > 12) {
//         hours = hours - 12
//         timeOfDay = "PM"
//     }
//     return hours + ":" + minutes + ":" + seconds + " " + timeOfDay
// }

// // Function to search for a product from an API
// async function searchProduct(query) {
//     const url = `https://dummyjson.com/products/search?q=${query}`;
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         return null;
//     }
// }

// // Define your ChatGPT Function
// async function callChatGPTWithFunctions(appendString) {
//     let messages = [{
//         role: "system",
//         content: "Perform function requests for the user",
//     }, {
//         role: "user",
//         content: `I am Adarsh, and I would like to ${appendString}`,
//     }];
//     // Step 1: Call ChatGPT with the function name
//     let chat = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo-0613",
//         messages,
//         functions: [{
//                 name: "helloWorld",
//                 description: "Prints hello world with the string passed to it",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         appendString: {
//                             type: "string",
//                             description: "The string to append to the hello world message",
//                         },
//                     },
//                     require: ["appendString"],
//                 }
//             },
//             {
//                 name: "getTimeOfDay",
//                 description: "Get the time of day.",
//                 parameters: {
//                     type: "object",
//                     properties: {},
//                     require: [],
//                 }
//             },
//             {
//                 name: "searchProduct",
//                 description: "Search for a product from an API.",
//                 parameters: {
//                     type: "object",
//                     properties: {
//                         query: {
//                             type: "string",
//                             description: "The query string to search for the product",
//                         },
//                     },
//                     require: ["query"],
//                 }
//             }
//         ],
//         function_call: "auto",
//     })
//     console.log(chat.choices[0].finish_reason)
//     let wantsToUseFunction = (chat.choices[0].finish_reason == 'function_call')

//     let content = ""
//     // Step 2: Check if ChatGPT wants to use a function
//     if (wantsToUseFunction) {
//         // Step 3: Use ChatGPT arguments to call your function
//         if (chat.choices[0].message.function_call.name == "helloWorld") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
//             content = helloWorld(argumentObj.appendString)
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "helloWorld",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name == "getTimeOfDay") {
//             content = getTimeOfDay()
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "getTimeOfDay",
//                 content,
//             })
//         }
//         if (chat.choices[0].message.function_call.name == "searchProduct") {
//             let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
//             const products = await searchProduct(argumentObj.query);
//             if (products) {
//                 content = JSON.stringify(products);
//                 searchProduct=content
//                 console.log("searchProduct=",searchProduct)
//             } else {
//                 content = "Error searching for the product.";
//             }
//             messages.push(chat.choices[0].message)
//             messages.push({
//                 role: "function",
//                 name: "searchProduct",
//                 content,
//             })
//         }
//     }


//     // Step 4: Call ChatGPT again with the function response
//     let step4response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo-0613",
//         messages,
//     });
//     return (step4response.choices[0])

// }

// module.exports = { callChatGPTWithFunctions,searchProduct };









































// const { OpenAI } = require('openai');

// const apiKey = "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";

// const openai = new OpenAI({
//     apiKey: apiKey,dangerouslyAllowBrowser: true
// });

// //const openai = new OpenAIApi(configuration);

// // Define your function
// function helloWorld(appendString){ 
// 	let hello = "Hello World! " + appendString
// 	return hello
// }

// // Get the current time of day
// function getTimeOfDay(){
// 	let date = new Date()
// 	let hours = date.getHours()
// 	let minutes = date.getMinutes()
// 	let seconds = date.getSeconds()
// 	let timeOfDay = "AM"
// 	if(hours > 12){
// 		hours = hours - 12
// 		timeOfDay = "PM"
// 	}
// 	return hours + ":" + minutes + ":" + seconds + " " + timeOfDay
// }

// // Define your ChatGPT Function
// async function callChatGPTWithFunctions(appendString){
// 	let messages = [{
// 		role: "system",
// 		content: "Perform function requests for the user",
// 	},{
// 		role: "user",
// 		content: `I am Adarsh, and i would like to ${appendString}`,
// 	}];
// 	// Step 1: Call ChatGPT with the function name
// 	let chat = await openai.chat.completions.create({
// 		model: "gpt-3.5-turbo-0613",
// 		messages,
// 		functions: [{
// 			name: "helloWorld",
// 			description: "Prints hello world with the string passed to it",
// 			parameters: {
// 				type: "object",
// 				properties: {
// 					appendString: {
// 						type: "string",
// 						description: "The string to append to the hello world message",
// 					},
// 				},
// 				require: ["appendString"],
// 			}
// 		},
// 		{
// 			name: "getTimeOfDay",
// 			description: "Get the time of day.",
// 			parameters: {
// 				type: "object",
// 				properties: {
// 				},
// 				require: [],
// 			}
// 		}],
// 		function_call: "auto",
// 	})
// 	console.log(chat.choices[0].finish_reason)
// 	let wantsToUseFunction = (chat.choices[0].finish_reason == 'function_call')

// 	let content = ""
// 	// Step 2: Check if ChatGPT wants to use a function
// 	if(wantsToUseFunction){
// 		// Step 3: Use ChatGPT arguments to call your function
// 		if(chat.choices[0].message.function_call.name == "helloWorld"){
// 			let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments)
// 			content = helloWorld(argumentObj.appendString)
// 			messages.push(chat.choices[0].message)
// 			messages.push({
// 				role: "function",
// 				name: "helloWorld", 
// 				content,
// 			})
// 		}
// 		if(chat.choices[0].message.function_call.name == "getTimeOfDay"){
// 			content = getTimeOfDay()
// 			messages.push(chat.choices[0].message)
// 			messages.push({
// 				role: "function",
// 				name: "getTimeOfDay", 
// 				content,
// 			})
// 		}
// 	}

	
// 	// Step 4: Call ChatGPT again with the function response
// 	let step4response = await openai.chat.completions.create({
// 		model: "gpt-3.5-turbo-0613",
// 		messages,
// 	});
// 	return (step4response.choices[0])
	
// }

// export {callChatGPTWithFunctions}
