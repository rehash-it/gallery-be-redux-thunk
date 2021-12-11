const { Gallery } = require('../models/gallery');
const { GalleryCategory } = require('../models/gallery_category');
const { removeDuplicates } = require('../utils/common');
const { matchString } = require('../utils/search');
const { UpcomingEvents } = require('../models/upcoming_events');

const getPageData = (query, data) => {
    // api/search/index?p=1&limit=8
    const { page, limit: l } = query
    const p = page ? parseInt(page) : 1
    const limit = l ? parseInt(l) : data.length
    let datas = data.slice(((p * limit) - limit), (p * limit))
    return datas.reverse()
}
/** */
const search = async (req, res) => {
    const query = req.query
    const { index } = req.params
    const galleries = await Gallery.find()
    const albums = await GalleryCategory.find()
    const events = await UpcomingEvents.find()
    /**news */
    const searchedGalleries = Search(index, galleries, ['description', 'tags'])
    const searchedAlbums = Search(index, albums, ['description'])
    const searchedEvents = Search(index, events, ['description', 'host', 'organizer', 'title', 'place'])
    let result = {
        galleries: {
            data: getPageData(query, searchedGalleries),
            length: searchedGalleries.length
        },
        albums: {
            data: getPageData(query, searchedAlbums),
            length: searchedAlbums.length
        },
        events: {
            data: getPageData(query, searchedEvents),
            length: searchedEvents.length
        }
    }
    res.send(result)
}

const Search = (index, datas, params) => {
    let newData = []
    datas.forEach(data => {
        for (var i in data) {
            params.forEach(p => {
                if (i === p) {
                    matchString(index, data[i]) ? newData.push(data) : () => { }
                }
            })
        }
    })
    return removeDuplicates(newData, '_id')
}
module.exports = { search }