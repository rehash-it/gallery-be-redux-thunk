const { Gallery } = require("../models/gallery");
const { GalleryCategory } = require("../models/gallery_category");
const { removeDuplicates } = require("../utils/common");
const { matchString } = require("../utils/search");
const { UpcomingEvents } = require("../models/upcoming_events");
const APIFeatures = require("./../utils/APIFeatures");

const getPageData = (query, data) => {
  // api/search/index?p=1&limit=8
  const { page, limit: l } = query;
  const p = page ? parseInt(page) : 1;
  const limit = l ? parseInt(l) : data.length;
  let datas = data.slice(p * limit - limit, p * limit);
  return datas.reverse();
};
/** */
const search = async (req, res) => {
  const query = req.query;
  const { index } = req.params;
  const GalleryApiFeatures = new APIFeatures(
    Gallery.find({ status: "APPROVED" }).sort("description"),
    req.query
  )
    .filter()
    .sort()
    .limitFields();

  const galleries = await GalleryApiFeatures.query;
  const AlbumApiFeatures = new APIFeatures(GalleryCategory.find().sort("description"), req.query)
    .filter()
    .sort()
    .limitFields();

  const albums = await AlbumApiFeatures.query;

  const UpcomingEventApiFeatures = new APIFeatures(UpcomingEvents.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const events = await UpcomingEventApiFeatures.query;
  /**news */
  const searchedGalleries = Search(index, galleries, ["description", "tags", "captions"]);

  const searchGalleriesCategory = Search(index, galleries, ["description", "tags", "captions"]);

  const searchedAlbums = Search(index, albums, ["description"]);
  const searchedEvents = Search(index, events, [
    "description",
    "host",
    "organizer",
    "title",
    "place",
  ]);
  let result = {
    galleries: {
      data: getPageData(query, searchedGalleries),
      length: searchedGalleries.length,
    },
    galleriesCategory: {
      data: getPageData(query, searchGalleriesCategory),
      length: searchGalleriesCategory.length,
    },
    albums: {
      data: getPageData(query, searchedAlbums),
      length: searchedAlbums.length,
    },
    events: {
      data: getPageData(query, searchedEvents),
      length: searchedEvents.length,
    },
  };
  res.send(result);
};

const Search = (index, datas, params) => {
  let newData = [];
  let Datas = datas.map((d) => {
    return { ...d._doc, _id: d._doc._id.toString() };
  });

  Datas.forEach((data) => {
    for (var i in data) {
      params.forEach((p) => {
        if (i === p) {
          typeof data[i] === "object"
            ? data[i].forEach((a) => {
                matchString(index, a) ? newData.push(data) : () => {};
              })
            : matchString(index, data[i])
            ? newData.push(data)
            : () => {};
        }
      });
    }
  });
  let items = removeDuplicates(newData, "_id");
  return removeDuplicates(newData, "_id");
};
module.exports = { search };
