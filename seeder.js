const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models

const Message = require('./models/Message');
const User = require('./models/User');
const Partner = require('./models/Partner');
const ArticleCategory = require('./models/ArticleCategory');
const Article = require('./models/Article');
const CollectPoint = require('./models/CollectPoint');
const PlasticType = require('./models/Plastic_type');
const Collect = require('./models/Collect');
const RecyclableProduct = require('./models/RecyclableProduct');




// Connect to DB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

// Read JSON files

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const messages = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/messages.json`, 'utf-8')
);
const partners = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/partners.json`, 'utf-8')
  );
const articleCategories = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/articleCategories.json`, 'utf-8')
  );
const articles = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/articles.json`, 'utf-8')
  );
const collectPoints = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/collectPoints.json`, 'utf-8')
  );
const plastic_types = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/plastic_types.json`, 'utf-8')
  );
const recyclableProducts = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/recyclableProducts.json`, 'utf-8')
  );
const collects = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/collects.json`, 'utf-8')
  );




// Import into DB
const importData = async () => {
  try {
   
    await Message.create(messages);
    await User.create(users);
    await Partner.create(partners);
    await ArticleCategory.create(articleCategories);
    await Article.create(articles);
    await CollectPoint.create(collectPoints);
    await Collect.create(collects);
    await PlasticType.create(plastic_types);
    await RecyclableProduct.create(recyclableProducts);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
      await Message.deleteMany();
    await User.deleteMany();
    await Partner.deleteMany();
    await ArticleCategory.deleteMany();
    await Article.deleteMany();
    await CollectPoint.deleteMany();
    await PlasticType.deleteMany();
    await Collect.deleteMany();
    await RecyclableProduct.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
