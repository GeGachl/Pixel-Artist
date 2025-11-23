import Painting from '../model/Painting/painting.js'
export const getAll = async (req, res) => {
  try {
    const posts = await Painting.find()
    res.status(200).json(posts)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Что-то пошло не так при получении постов' })
  }
}

export const addPost = async (req, res) => {
  try {
    const {
      pictureName,
      pictureDescription,
      publicity,
      imageDataUrl,
      pictureDate,
      username,
    } = req.body
    const post = await Painting.create({
      name: pictureName,
      description: pictureDescription,
      publicity: publicity,
      userId: req.user.userId,
      username: username,
      url: imageDataUrl,
      date: pictureDate,
    })
    res.status(201).json(post)
  } catch (err) {
    res
      .status(500)
      .json({ message: `Что-то пошло не так при добавлении поста ${err}` })
  }
}

export const deletePost = async (req, res) => {
  try {
    const paintingId = req.params.id
    const post = await Painting.findByIdAndDelete(paintingId)
    res.status(201).json(post)
  } catch (err) {
    res
      .status(500)
      .json({ message: `Что-то пошло не так при удалении поста ${err}` })
  }
}
