exports.injectRelativePath = (req, res, next) => {
  res.locals.relativePath = process.env.RELATIVE_PATH || "";
  next();
};
