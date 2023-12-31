var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../MyanmarProverbs.json');

router.get('/', async (req, res, next) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    let fetchData;
    try {
      fetchData = JSON.parse(data);
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      throw new Error('Invalid JSON format');
    }
    const tbl_MMProverbsTitle = fetchData && fetchData.Tbl_MMProverbsTitle;
    res.render('index', { title: 'Myanmar Proverbs', data: tbl_MMProverbsTitle });
  } catch (error) {
    next(error);
  }
});

router.get('/search', async function (req, res, next) {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter (q)' });
    }

    const data = await fs.readFile(filePath, 'utf8');

    const jsonData = JSON.parse(data);

    if (!jsonData.Tbl_MMProverbs || !Array.isArray(jsonData.Tbl_MMProverbs)) {
      return res.status(500).json({ error: 'Invalid JSON data structure' });
    }

    const searchResults = jsonData.Tbl_MMProverbs.filter(result =>
      result.ProverbName.toLowerCase().includes(query.toLowerCase())
    );
    res.json(searchResults);
  } catch (error) {
    console.error('Error:', error);

    if (error instanceof SyntaxError) {
      return res.status(400).json({ error: 'Invalid JSON format' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
