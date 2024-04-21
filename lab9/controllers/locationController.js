const {
    listAllLocations,
    findLocationById,
    addOneLocation,
    modifyLocation,
    removeLocation,
  } = require("../models/locationModel");
  
  const getLocations = async (req, res) => {
    res.json(await listAllLocations());
  };
  
  const getLocation = async (req, res) => {
    const location = await findLocationById(req.params.id);
    if (location) {
      res.json(location);
    } else {
      res.sendStatus(404);
    }
  };
  
  const addLocation = async (req, res) => {
    console.log('postLocation', req.body);
  
    const result = await addOneLocation(req.body);
    if (result.location_id) {
      res.status(201);
      res.json({ message: "New location added.", result });
    } else {
      res.sendStatus(400);
    }
  };
  
  const updateLocation = async (req, res) => {
    const result = await modifyLocation(req.body, req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.json(result);
  };
  
  const deleteLocation = async (req, res) => {
    const result = await removeLocation(req.params.id);
    console.log("tes",req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.json(result);
  };
   
  module.exports = { getLocations, getLocation, addLocation, updateLocation, deleteLocation };
   
  
  