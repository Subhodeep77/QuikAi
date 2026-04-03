import mongoose from "mongoose";

const creationSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
            trim: true,
        },

        prompt: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            required: true,
            enum: ["resume-review", "image", "article","blog-title"],
        },

        publish: {
            type: Boolean,
            default: false,
        },

        likes: {
            type: [String],
            default: [],
        }
    },
    {
        timestamps: true,
    }
);

creationSchema.index({ user_id: 1 });
creationSchema.index({ createdAt: -1 });
creationSchema.index({ publish: 1, createdAt: -1 });

creationSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

creationSchema.set("toJSON", { virtuals: true });
creationSchema.set("toObject", { virtuals: true });

const Creation = mongoose.model("Creation", creationSchema);

export default Creation;