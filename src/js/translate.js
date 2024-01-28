const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const fetch = require('node-fetch');
const DeepL = require('deepl');

const app = express();
const port = 3000;

app.options('*', cors()); // Handle preflight requests
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:57465',
  })
); // Enable CORS for all routes

app.post('/translateRecipe/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    const recipeDetails = await fetchRecipeDetails(recipeId);
    const translatedRecipe = await translateRecipe(recipeDetails);

    res.json(translatedRecipe);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const fetchRecipeDetails = async function (id) {
  try {
    const resp = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await resp.json();
    const { recipe } = data.data;

    return recipe;
  } catch (error) {
    throw new Error('Error fetching recipe details');
  }
};

const translateRecipe = async function (recipe) {
  // The same implementation as before...
  try {
    const apiKey = 'b0952056-d8cf-a842-0f40-ef8855ea610c:fx';
    const sourceLang = 'en'; // Assuming the original recipe is in English
    const targetLang = 'es'; // Replace with your target language code

    // Extract text content from the recipe (modify based on your actual JSON structure)
    const textToTranslate = JSON.stringify(recipe);

    // Initialize the DeepL API client
    const deepl = new DeepL(apiKey);

    // Send a request to DeepL API for translation
    const translationResult = await deepl.translate({
      text: textToTranslate,
      sourceLang,
      targetLang,
    });

    // Access the translated text
    const translatedText = translationResult.translations[0].text;

    // Parse the translated JSON
    const translatedRecipe = JSON.parse(translatedText);

    return translatedRecipe;
  } catch (error) {
    throw new Error('Error during translation');
  }
};

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
