const Tour = require('../models/tourModel');

//https://mongoosejs.com/docs/index.html
//Displays  all the tours
//200 - Success
exports.getAllTours = async (req, res) => {
  //read the data from database.find() method reads all the data from the database
  //find will return array of data and also converts the data in javaScript object
  try {
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // delete the obove fields from the queryobj
    excludeFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let querystr = JSON.stringify(queryObj);
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    //console.log(JSON.parse(querystr));
    let query = Tour.find(JSON.parse(querystr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const tours = await query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

//Displays a tour by ID
exports.getTour = async (req, res) => {
  //Tour.findOne({ _id: req.params.id}) its short hande is findById()
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

//Creates a new tour
//201 - Created
exports.createTour = async (req, res) => {
  //const newTour = new Tour({})
  //newTour.save().then().catch()
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

//updates an exiting tour
exports.updateTour = async (req, res) => {
  //console.log(req.params);
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true // validators that are decleare at the schema string,number,number
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent'
    });
  }
};

//delete a tour
//204 No Content
exports.deleteTour = async (req, res) => {
  //console.log(req.params);
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent'
    });
  }
};
