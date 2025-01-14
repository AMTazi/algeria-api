const xmlify = require('xmlify');
const { Wilaya } = require('../models/index');
const { getWilayasNames } = require('../utils');

const wilayaController = {
  list: async (req, res) => {
    const resFormat = req.query.format || 'json';
    try {
      const wilayas = await Wilaya.find({}, {
        _id: 0, __v: 0, 'dairats._id': 0, 'dairats.baladyiats._id': 0,
      }).exec();

      switch (resFormat) {
        case 'xml':
          res.type('application/xml');
          return res.send(xmlify(wilayas, 'wilayas'));
        default:
          return res.status(200).json({ data: wilayas });
      }
    } catch (error) {
      return res.status(500).json({ msg: 'Error!' });
    }
  },
  wilayaByMatricule: async (req, res) => {
    const resFormat = req.query.format || 'json';
    const mattricule = Number(req.params.matricule);

    try {
      const theWilaya = await Wilaya.findOne({ mattricule }, {
        _id: 0, 'dairats._id': 0, 'dairats.baladyiats._id': 0, __v: 0,
      }).exec();

      switch (resFormat) {
        case 'xml':
          res.type('application/xml');
          return res.send(xmlify(theWilaya, 'wilaya'));
        default:
          return res.status(200).jsonp({ data: theWilaya });
      }
    } catch (error) {
      return res.status(500).json({ msg: 'Error!' });
    }
  },
  adjacentWilayas: async (req, res) => {
    const resFormat = req.query.format || 'json';
    const mattricule = Number(req.params.matricule);
    try {
      const theWilaya = await Wilaya.findOne({ mattricule }).exec();

      const { adjacentWilayas } = theWilaya;

      switch (resFormat) {
        case 'xml':
          // eslint-disable-next-line no-case-declarations
          const xmlResponse = xmlify(Array.from(adjacentWilayas), { root: 'wilayas' });
          res.type('application/xml');
          return res.send(xmlResponse);
        default:
          return res.status(200).json({ data: adjacentWilayas });
      }
    } catch (error) {
      return res.status(500).json({ msg: 'Error!' });
    }
  },
  adjacentWilayasNames: async (req, res) => {
    const resFormat = req.query.format || 'json';
    const mattricule = Number(req.params.matricule);
    const { lang } = req.params;

    try {
      const theWilaya = await Wilaya.findOne({ mattricule }).exec();
      const { adjacentWilayas } = theWilaya;
      const adjacentWilayasWithNames = getWilayasNames(adjacentWilayas, lang);
      switch (resFormat) {
        case 'xml':
          // eslint-disable-next-line no-case-declarations
          const xmlResponse = xmlify({ wilayas: Array.from(adjacentWilayasWithNames) }, { root: 'wilayas' });
          res.type('application/xml');
          return res.send(xmlResponse);
        default:
          return res.status(200).json({
            data: {
              names: adjacentWilayasWithNames,
              mattricules: adjacentWilayas,
            },
          });
      }
    } catch (error) {
      return res.status(500).json({ msg: 'Error!' });
    }
  },
};

module.exports = wilayaController;
