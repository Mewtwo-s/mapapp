const  Axios = require('axios')
const router = require('express').Router()
module.exports = router

router.post('/', async (req, res, next) => {
  try {

       let { data } = await Axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=cafe&input=coffee&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&rankby=distance&location=${req.body.lat},${req.body.lng}&key=${process.env.GOOGLE_MAPS_BACKEND_KEY}`);
    // if no result from edge - textSearch
      if(data.results.length === 0){
        let result = await Axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?&input=coffee&inputtype=textquery&type=cafe&fields=photos,formatted_address,name,opening_hours,rating&radius=1000&location=${req.body.lat},${req.body.lng}&key=${process.env.GOOGLE_MAPS_BACKEND_KEY}`);
        data = result.data;
        console.log('CORNFIELD case', data);
      }
         const places = data.results.filter(place => !place.types.includes("gas_station") && place.rating > 3.8).slice(0, 3);
         
       res.send(places)
  } catch (err) {
    next(err)
  }
})

