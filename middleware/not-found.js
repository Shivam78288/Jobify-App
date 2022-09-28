const notFoundMiddleware = (req, res) =>
  res.status(404).send({ success: false, msg: "Route does not exist" });

export default notFoundMiddleware;
