const express = require("express");
const cors = require("cors");
const { NlpManager } = require('node-nlp');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use(cors());

// Other middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// NLP manager initialization
const manager = new NlpManager({ languages: ['en'] });

//Define the navigation intents and their corresponding route paths
const navigationIntents = {
  'move to wishlist': '/wishlist',
  'go to wishlist': '/wishlist',
  'move to account': '/account',
  'go to account': '/account',
  'move to shop': '/shop',
  'go to shop': '/shop',
  'move to category': '/category',
  'go to category': '/category',
  'move to item': '/item',
  'go to item': '/item',
  'move to search': '/search',
  'go to search': '/search',
};

// Add navigation intents to the NLP manager
for (const [intent, routePath] of Object.entries(navigationIntents)) {
  manager.addDocument('en', intent, `nav:${routePath}`);
}

// Generalize the training data for search intent
manager.addDocument('en', 'Find me a [color] [type]', 'search.product');
manager.addDocument('en', 'Show me [brand] [category]', 'search.product');
manager.addDocument('en', 'I want to buy a [brand] [type]', 'search.product');

// Add new intents for adding to wishlist and cart
manager.addDocument('en', 'Add [product] to my wishlist', 'wishlist.add');
manager.addDocument('en', 'Add [product] to my cart', 'cart.add');

// Train the NLP manager
manager.train();

//"find me a $color$*red*"item
// NLP endpoint

app.get('/', async (req, res) =>{
  res.send("running");
})
app.post('/api/nlp', async (req, res) => {

  const { text } = req.body;
    try {
        const response = await manager.process('en', text);
        if (response.intent.startsWith('nav:')) {
            const routePath = response.intent.substring(4);
            res.json({ navigation: routePath });
        } else if (response.intent === 'search.product') {
            console.log("search")//test
            const searchTerm = extractSearchTerm(response);
            const searchResults = performProductSearch(searchTerm);
            res.json({ searchResults });
        } else if (response.intent === 'wishlist.add') {
          console.log("wishlist")//test
            const product = extractProductInfo(response);
            // Logic to add product to wishlist
            res.json({ wishlist: 'Product added to wishlist' });
        } else if (response.intent === 'cart.add') {
          console.log("cart")//test
            const product = extractProductInfo(response);
            // Logic to add product to cart
            res.json({ cart: 'Product added to cart' });
        } else {
            res.json({ response });
        }
    } catch (error) {
        console.error("Error processing NLP:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Placeholder function to extract search term from NLP response
function extractSearchTerm(nlpResponse) {
    // Logic to extract search term from NLP response
}

// Placeholder function to perform product search
function performProductSearch(searchTerm) {
    // Logic to search products based on search term
}


// Placeholder function to extract product information from NLP response
function extractProductInfo(nlpResponse) {
    // Logic to extract product information from NLP b
}

// Other routes
app.use('/api/items', require("./routes/items"));
app.use('/api/payment', cors(), require("./routes/payment"));
app.post('/openai', async (req, res) =>{
  
})



app.listen(PORT, console.log("Server is running on port ", PORT));
