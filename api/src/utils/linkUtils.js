
/**
getLinks is a function that returns an array of links for pagination purposes.
@param {number} offset - The starting index of the items to retrieve
@param {number} limit - The maximum number of items to retrieve
@returns {Array} - An array of link objects with 'rel' and 'href' properties.
*/
const getLinks = (offset, limit) => [
  {
    rel: "self",
    href: `/products?offset=${offset}&limit=${limit}`,
  },
  {
    rel: "next",
    href: `/products?offset=${offset + limit}&limit=${limit}`,
  },
  {
    rel: "prev",
    href: `/products?offset=${Math.max(0, offset - limit)}&limit=${limit}`,
  },
];

module.exports = {
  getLinks,
};
