require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const nodemailer = require('nodemailer');


/**
 * GET /
 * HOMEPAGE
 */
exports.homepage = async(req, res) => {

    try {

        const limitNumber = 5;
        const limitNumberCategories = 4;
        const categories = await Category.find({}).sort({_id: -1}).limit(limitNumberCategories);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
        const ghanaian = await Recipe.find({ 'category': 'Ghanaian' }).limit(limitNumber);

        const food = { latest, thai, american, chinese, ghanaian };

        res.render('index', { title: 'Cooking Blog - Home', categories, food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }

}

/**
 * GET /categories
 * CATEGORIES
 */
exports.exploreCategories = async(req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Cooking Blog - Categories', categories });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

/**
 * GET /recipe/:id
 * RECIPE
 */
exports.exploreRecipe = async(req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'Cooking Blog - Recipe', recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }

}

/**
 * POST / SEARCH
 * SEARCH
 */
exports.searchRecipe = async(req, res) => {
    try {
        let searchTerm  = req.body.searchTerm;
        let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } } );        
        res.render('search', { title: 'Cooking Blog - Search', recipe });        
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

/**
 * GET /explore-latest
 * EXPLORE LATEST
 */
exports.exploreLatest = async(req, res) => {
    try {
        const limitNumber = 10;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe });        
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Blog - Explore Random', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /submit-recipe
 * SUBMIT RECIPE
*/
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}

/**
 * GET /about
 * ABOUT
 */
exports.aboutpage = async(req, res) => {
    try {
        res.render('about', { title: 'About'});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }

}

/**
 * GET /contact
 * CANTACT
 */
exports.contactpage = async(req, res) => {
    try {
        res.render('contact', { title: 'Contact'});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }

}

/**
 * POST /contact
 * CANTACT
 */
// exports.contactpageOnPost = async(req, res) => {
//     try {
//         console.log(req.body);

//         const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//             user: 'learniner1@gmail.com',
//             pass: 'learningmail1'
//           }
//         })

//         const mailOptions = {
//           from: req.body.uemail,
//           to: 'learniner1@gmail.com',
//           subject: `Message from ${req.body.uemail}: ${req.body.usubject}`,
//           text: req.body.umessage
//         }

//         transporter.sendMail(mailOptions, (error, info) => {
//           if(error) {
//             console.log(error);
//             res.send(error);
//           } else {
//             console.log('Email sent: ' + info.response);
//             res.send('Sent Successfully');
//           }
//         })

//     } catch (error) {
//         res.status(500).send({ message: error.message || "Error Occured" });
//     }

// }

// async function addCat() {
//   try {
//     await Category.insertMany([
//       {
//         "name": "Ghanaian",
//         "image": "ghanaian-food.jpg"
//       }
//     ])
//   } catch (error) {
//     console.log(error);
//   }
// }
// addCat();

// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();