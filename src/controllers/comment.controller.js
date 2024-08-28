import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    //TODO: get all comments for a video
    
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }

    const comments = await Comment.find({ video: videoId })
       .sort({ createAt: -1 })
       .skip((page - 1) * limit )
       .limit(parseInt(limit))
       .populate('user', 'fullName userName avatar');

    const totalComments = await Comment.countDocuments({vidoe: videoId});

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                comments,
                totalComments,
                page: parseInt(page),
                pages: Math.ceil(totalComments / limit)
            },
            "Comments fetched successfully"
        )
    );

});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { text } = req.body;

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }

    if(!text?.trim()){
        throw new ApiError(400, "Comment text is required");
    }

    const comment = await Comment.create({
        video: videoId,
        user: req.user._id,
        text
    })

    const populateComment = await comment.populate('user', 'fullName username avatar').execPopulate();

    return res.status(201).json(
        new ApiResponse(201, populateComment, "Comment added successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    if (!text?.trim()) {
        throw new ApiError(400, "Comment text is required");
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404, "comment not found");
    }

    if(comment.user.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.text = text;
    await comment.save();

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404, "Comment not found");
    }

    if (comment.user.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await comment.remove();

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment delete successfully")
    );
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    };
