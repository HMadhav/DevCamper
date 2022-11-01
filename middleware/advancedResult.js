const advancedResult = (model, populate) => async (req, res, next) => {
  let { select, sort, page, limit, ...query } = req.query;
  query = JSON.parse(
    JSON.stringify(query).replace(
      /\b(gt|lt|gte|lte|ne|in)\b/g,
      (match) => `$${match}`
    )
  );
  select = select && select.replace(/,/g, " ");
  sort = sort ? sort.replace(/,/g, " ") : "-createdAt";
  page = page ? parseInt(page.replace(/,/g, " "), 10) : 1;
  limit = limit ? parseInt(limit.replace(/,/g, " "), 10) : 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const result = populate
    ? await model
        .find(query, select, {
          sort,
          skip: startIndex,
          limit: limit,
        })
        .populate(populate)
    : await model.find(query, select, {
        sort,
        skip: startIndex,
        limit: limit,
      });

  res.advancedResult = {
    success: true,
    count: result.length,
    data: result,
    pagination,
  };

  next();
};

module.exports = advancedResult;
