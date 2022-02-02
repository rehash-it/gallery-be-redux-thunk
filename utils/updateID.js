const updateModelId = async (Model) => {
  const data = await Model.find();
  for (let i = 0; i < data.length; i++) {
    let d = data[i]._doc;
    let o = {};
    for (let i in d) {
      if (i !== "_id") o = { ...o, [i]: d[i] };
    }
    const deleteData = await Model.deleteOne({ _id: d._id });
    const newModel = new Model(o);
    const save = await newModel.save();
    console.log(save);
  }
};

module.exports = updateModelId;
