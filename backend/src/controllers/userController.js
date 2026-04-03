import Creation from '../models/creation.js'

export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth();

        const creations = await Creation
            .find({ user_id: userId })
            .sort({ createdAt: -1 })
            .lean();


        return res.status(200).json({
            success: true,
            creations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getPublishedCreations = async (req, res) => {
    try {

        const creations = await Creation.find({ publish: true })
            .sort({ createdAt: -1 });


        return res.status(200).json({
            success: true,
            creations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const creation = await Creation.findById(id).lean();

    if (!creation) {
      return res.status(404).json({
        success: false,
        message: "Creation not found",
      });
    }

    const alreadyLiked = creation.likes.includes(userId);

    const update = alreadyLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } }; // prevents duplicates

    await Creation.findByIdAndUpdate(id, update);

    return res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Creation unliked"
        : "Creation liked",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


