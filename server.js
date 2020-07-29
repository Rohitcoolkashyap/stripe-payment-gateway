const express = require('express')
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const app = express()
// Handle Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Body Parser Middleware
// app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// Set static Folder
app.use(express.static(`${__dirname}/public`));

// Index route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
});

// Charge route
app.post('/charge', async (req, res) => {
    const amount = 2500;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount,
        description: "E-book",
        currency: 'inr',
        customer: customer.id
    })).then(charge => res.render('success'))
})
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`))
